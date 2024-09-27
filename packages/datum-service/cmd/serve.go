package cmd

import (
	"context"
	"errors"

	"github.com/spf13/cobra"
	"go.uber.org/zap"

	ent "github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/entdb"
	"github.com/datum-cloud/datum-os/internal/httpserve/authmanager"
	"github.com/datum-cloud/datum-os/internal/httpserve/config"
	"github.com/datum-cloud/datum-os/internal/httpserve/server"
	"github.com/datum-cloud/datum-os/internal/httpserve/serveropts"
	"github.com/datum-cloud/datum-os/internal/services/resourcemanager"
	"github.com/datum-cloud/datum-os/internal/tool/grpctool"
	"github.com/datum-cloud/datum-os/pkg/cache"
	"github.com/datum-cloud/datum-os/pkg/fgax"
	geodetic "github.com/datum-cloud/datum-os/pkg/geodetic/pkg/geodeticclient"
	"github.com/datum-cloud/datum-os/pkg/otelx"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	resourcemanagerpb "go.datumapis.com/genproto/os/resourcemanager/v1alpha"
	"google.golang.org/grpc/credentials/insecure"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the Datum API Server",
	Run: func(cmd *cobra.Command, args []string) {
		err := serve(cmd.Context())
		cobra.CheckErr(err)
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	serveCmd.PersistentFlags().String("config", "./config/.config.yaml", "config file location")
}

func serve(ctx context.Context) error {
	// setup db connection for server
	var (
		fgaClient *fgax.Client
		err       error
	)

	// Creates a new gRPC server that can be used to expose gRPC services. All
	// gRPC services are defined in `api/` at the root of the repo.
	grpcServer := grpc.NewServer()
	gRPCRestProxy := runtime.NewServeMux()

	// Supports creating an in-memory listenre so we don't need to expose a
	// gRPC service externally.
	inMemoryListener := grpctool.NewDialListener()

	go func() {
		err := grpcServer.Serve(inMemoryListener)
		if err != nil {
			panic(err)
		}
	}()

	inMemoryConn, err := grpc.NewClient(
		"passthrough:api-server",
		grpc.WithSharedWriteBuffer(true),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithContextDialer(inMemoryListener.DialContext),
	)

	if err != nil {
		panic(err)
	}

	// Register the Projects server gRPC service
	resourcemanagerpb.RegisterProjectsServer(grpcServer, &resourcemanager.Projects{})

	errs := errors.Join(
		// Register the Projects service REST proxy
		resourcemanagerpb.RegisterProjectsHandler(ctx, gRPCRestProxy, inMemoryConn),
	)
	if errs != nil {
		panic(errs)
	}

	// create ent dependency injection
	entOpts := []ent.Option{ent.Logger(*logger)}

	serverOpts := []serveropts.ServerOption{}
	serverOpts = append(serverOpts,
		serveropts.WithConfigProvider(&config.ConfigProviderWithRefresh{}),
		serveropts.WithLogger(logger),
		serveropts.WithHTTPS(),
		serveropts.WithEmailManager(),
		serveropts.WithTaskManager(),
		serveropts.WithMiddleware(),
		serveropts.WithRateLimiter(),
		serveropts.WithSecureMW(),
		serveropts.WithCacheHeaders(),
		serveropts.WithCORS(),
		serveropts.WithAnalytics(),
		serveropts.WithEventPublisher(),
	)

	so := serveropts.NewServerOptions(serverOpts, k.String("config"))

	// Create keys for development
	if so.Config.Settings.Auth.Token.GenerateKeys {
		so.AddServerOptions(serveropts.WithGeneratedKeys())
	}

	// add auth session manager
	so.Config.Handler.AuthManager = authmanager.New()

	// setup token manager
	so.AddServerOptions(
		serveropts.WithTokenManager(),
	)

	err = otelx.NewTracer(so.Config.Settings.Tracer, appName, logger)
	if err != nil {
		logger.Fatalw("failed to initialize tracer", "error", err)
	}

	if so.Config.Settings.Authz.Enabled {
		// setup Authz connection
		// this must come before the database setup because the FGA Client
		// is used as an ent dependency
		fgaClient, err = fgax.CreateFGAClientWithStore(ctx, so.Config.Settings.Authz, so.Config.Logger)
		if err != nil {
			return err
		}
	}

	// Setup Redis connection
	redisClient := cache.New(so.Config.Settings.Redis)
	defer redisClient.Close()

	// add session manager
	so.AddServerOptions(
		serveropts.WithSessionManager(redisClient),
	)

	// add otp manager, after redis is setup
	so.AddServerOptions(
		serveropts.WithOTP(),
	)

	if so.Config.Settings.Authz.Enabled {
		entOpts = append(entOpts, ent.Authz(*fgaClient))
	}

	// add additional ent dependencies
	entOpts = append(
		entOpts,
		ent.Emails(so.Config.Handler.EmailManager),
		ent.Marionette(so.Config.Handler.TaskMan),
		ent.Analytics(so.Config.Handler.AnalyticsClient),
		ent.TOTP(so.Config.Handler.OTPManager),
		ent.TokenManager(so.Config.Handler.TokenManager),
		ent.SessionConfig(so.Config.Handler.SessionConfig),
		ent.EntConfig(&so.Config.Settings.EntConfig),
	)

	// Setup DB connection
	entdbClient, dbConfig, err := entdb.NewMultiDriverDBClient(ctx, so.Config.Settings.DB, logger, entOpts)
	if err != nil {
		return err
	}

	defer entdbClient.Close()

	// Add Driver to the Handlers Config
	so.Config.Handler.DBClient = entdbClient

	// Add redis client to Handlers Config
	so.Config.Handler.RedisClient = redisClient

	// add ready checks
	so.AddServerOptions(
		serveropts.WithReadyChecks(dbConfig, fgaClient, redisClient),
	)

	// add auth options
	so.AddServerOptions(
		serveropts.WithAuth(),
	)

	// add session manager
	so.AddServerOptions(
		serveropts.WithSessionMiddleware(),
	)

	srv := server.NewServer(so.Config, so.Config.Logger)

	// Setup Graph API Handlers
	so.AddServerOptions(serveropts.WithGraphRoute(srv, entdbClient))

	if err := srv.StartEchoServer(ctx, gRPCRestProxy); err != nil {
		logger.Error("failed to run server", zap.Error(err))
	}

	return nil
}
