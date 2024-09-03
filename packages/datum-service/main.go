// package main is the entry point
package main

import (
	"github.com/datum-cloud/datum-os/cmd"
	_ "github.com/datum-cloud/datum-os/internal/ent/generated/runtime"
)

func main() {
	cmd.Execute()
}
