package datumgroupsetting

import (
	"encoding/json"
	"strings"

	"github.com/spf13/cobra"

	datum "github.com/datum-cloud/datum-os/cmd/cli/cmd"
	"github.com/datum-cloud/datum-os/pkg/datumclient"
	"github.com/datum-cloud/datum-os/pkg/utils/cli/tables"
)

// cmd represents the base group setting command when called without any subcommands
var cmd = &cobra.Command{
	Use:   "group-setting",
	Short: "the subcommands for working with the datum group settings",
}

func init() {
	datum.RootCmd.AddCommand(cmd)
}

// consoleOutput prints the output in the console
func consoleOutput(e any) error {
	// check if the output format is JSON and print the output in JSON format
	if datum.OutputFormat == datum.JSONOutput {
		return jsonOutput(e)
	}

	// check the type of the output and print them in a table format
	switch v := e.(type) {
	case *datumclient.GetAllGroupSettings:
		var nodes []*datumclient.GetAllGroupSettings_GroupSettings_Edges_Node

		for _, i := range v.GroupSettings.Edges {
			nodes = append(nodes, i.Node)
		}

		e = nodes
	case *datumclient.GetGroupSettingByID:
		e = v.GroupSetting
	case *datumclient.UpdateGroupSetting:
		e = v.UpdateGroupSetting.GroupSetting
	}

	s, err := json.Marshal(e)
	cobra.CheckErr(err)

	var list []datumclient.GroupSetting

	err = json.Unmarshal(s, &list)
	if err != nil {
		var in datumclient.GroupSetting
		err = json.Unmarshal(s, &in)
		cobra.CheckErr(err)

		list = append(list, in)
	}

	tableOutput(list)

	return nil
}

// jsonOutput prints the output in a JSON format
func jsonOutput(out any) error {
	s, err := json.Marshal(out)
	cobra.CheckErr(err)

	return datum.JSONPrint(s)
}

// tableOutput prints the output in a table format
func tableOutput(out []datumclient.GroupSetting) {
	writer := tables.NewTableWriter(cmd.OutOrStdout(), "ID", "GroupName", "Tags", "Visibility", "SyncToGithub", "SyncToSlack")
	for _, i := range out {
		writer.AddRow(i.ID, i.Group.Name, strings.Join(i.Tags, ", "), i.Visibility, *i.SyncToGithub, *i.SyncToSlack)
	}

	writer.Render()
}
