package main

import (
	datum "github.com/datum-cloud/datum-os/cmd/cli/cmd"

	// since the cmds are not part of the same package
	// they must all be imported in main
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/apitokens"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/contact"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitlementplan"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitlementplanfeatures"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitlements"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entity"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitytype"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/events"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/features"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/group"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/groupmembers"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/groupsetting"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/integration"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/invite"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/login"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/organization"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/organizationsetting"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/orgmembers"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/personalaccesstokens"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/register"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/reset"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/search"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/subscriber"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/switch"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/template"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/user"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/usersetting"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/version"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/webhook"

	// history commands
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/documentdatahistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitlementhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entityhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/entitytypehistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/eventhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/featurehistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/filehistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/grouphistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/groupmembershiphistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/groupsettinghistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/hushhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/integrationhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/oauthproviderhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/organizationhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/organizationsettinghistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/orgmembershiphistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/templatehistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/userhistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/usersettinghistory"
	_ "github.com/datum-cloud/datum-os/cmd/cli/cmd/webhookhistory"
)

func main() {
	datum.Execute()
}
