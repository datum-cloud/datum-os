package datumtemplatehistory

import (
	"encoding/json"

	"github.com/spf13/cobra"

	datum "github.com/datum-cloud/datum-os/cmd/cli/cmd"
	"github.com/datum-cloud/datum-os/pkg/datumclient"
	"github.com/datum-cloud/datum-os/pkg/utils/cli/tables"
)

// cmd represents the base templateHistory command when called without any subcommands
var cmd = &cobra.Command{
	Use:   "template-history",
	Short: "the subcommands for working with datum templateHistories",
}

func init() {
	datum.RootCmd.AddCommand(cmd)
}

// consoleOutput prints the output in the console
func consoleOutput(e any) error {
	// check if the output format is JSON and print the templateHistories in JSON format
	if datum.OutputFormat == datum.JSONOutput {
		return jsonOutput(e)
	}

	// check the type of the templateHistories and print them in a table format
	switch v := e.(type) {
	case *datumclient.GetAllTemplateHistories:
		var nodes []*datumclient.GetAllTemplateHistories_TemplateHistories_Edges_Node

		for _, i := range v.TemplateHistories.Edges {
			nodes = append(nodes, i.Node)
		}

		e = nodes
	case *datumclient.GetTemplateHistories:
		var nodes []*datumclient.GetTemplateHistories_TemplateHistories_Edges_Node

		for _, i := range v.TemplateHistories.Edges {
			nodes = append(nodes, i.Node)
		}

		e = nodes
	}

	s, err := json.Marshal(e)
	cobra.CheckErr(err)

	var list []datumclient.TemplateHistory

	err = json.Unmarshal(s, &list)
	if err != nil {
		var in datumclient.TemplateHistory
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
func tableOutput(out []datumclient.TemplateHistory) {
	// create a table writer
	writer := tables.NewTableWriter(cmd.OutOrStdout(), "ID", "Ref", "Operation", "UpdatedAt", "UpdatedBy")
	for _, i := range out {
		writer.AddRow(i.ID, *i.Ref, i.Operation, *i.UpdatedAt, *i.UpdatedBy)
	}

	writer.Render()
}
