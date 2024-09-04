package geodeticdatabase

import (
	"github.com/spf13/cobra"

	geodetic "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd"
)

// databaseCmd represents the base database command when called without any subcommands
var databaseCmd = &cobra.Command{
	Use:   "database",
	Short: "The subcommands for working with geodetic databases",
}

func init() {
	geodetic.RootCmd.AddCommand(databaseCmd)
}
