package main

import (
	geodetic "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd"

	// since the cmds are no longer part of the same package
	// they must all be imported in main
	_ "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd/database"
	_ "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd/group"
	_ "github.com/datum-cloud/datum-os/pkg/geodetic/cmd/cli/cmd/version"
)

func main() {
	geodetic.Execute()
}
