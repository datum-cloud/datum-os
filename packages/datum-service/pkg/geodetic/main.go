// package main is the entry point
package main

import (
	"github.com/datum-cloud/datum-os/pkg/geodetic/cmd"
	_ "github.com/datum-cloud/datum-os/pkg/geodetic/internal/ent/generated/runtime"
)

func main() {
	cmd.Execute()
}
