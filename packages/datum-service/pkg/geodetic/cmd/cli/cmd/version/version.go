package version

import (
	"github.com/spf13/cobra"

	"github.com/datum-cloud/datum-os/pkg/utils/cli/useragent"

	geodetic "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd"
	"github.com/datum-cloud/datum-os/pkg/geodetic/internal/constants"
)

// VersionCmd is the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print geodetic CLI version",
	Long:  `The version command prints the version of the geodetic CLI`,
	Run: func(cmd *cobra.Command, _ []string) {
		cmd.Println(constants.VerboseCLIVersion)
		cmd.Printf("User Agent: %s\n", useragent.GetUserAgent())
	},
}

func init() {
	geodetic.RootCmd.AddCommand(versionCmd)
}
