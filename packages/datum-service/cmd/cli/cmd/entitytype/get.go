package datumentitytype

import (
	"context"

	"github.com/spf13/cobra"

	datum "github.com/datum-cloud/datum-os/cmd/cli/cmd"
)

var getCmd = &cobra.Command{
	Use:   "get",
	Short: "get an existing datum entity type",
	Run: func(cmd *cobra.Command, args []string) {
		err := get(cmd.Context())
		cobra.CheckErr(err)
	},
}

func init() {
	cmd.AddCommand(getCmd)

	getCmd.Flags().StringP("id", "i", "", "entity type id to query")
}

// get an existing entity type in the datum platform
func get(ctx context.Context) error {
	// setup datum http client
	client, err := datum.SetupClientWithAuth(ctx)
	cobra.CheckErr(err)
	defer datum.StoreSessionCookies(client)
	// filter options
	id := datum.Config.String("id")

	// if an entityType ID is provided, filter on that entity type, otherwise get all
	if id != "" {
		o, err := client.GetEntityTypeByID(ctx, id)
		cobra.CheckErr(err)

		return consoleOutput(o)
	}

	// get all will be filtered for the authorized organization(s)
	o, err := client.GetAllEntityTypes(ctx)
	cobra.CheckErr(err)

	return consoleOutput(o)
}
