-- +goose Up
-- create "contact_list_history" table
CREATE TABLE "contact_list_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "name" character varying NOT NULL, "visibility" character varying NOT NULL DEFAULT 'PRIVATE', "display_name" character varying NOT NULL DEFAULT '', "description" character varying NULL, PRIMARY KEY ("id"));
-- create index "contactlisthistory_history_time" to table: "contact_list_history"
CREATE INDEX "contactlisthistory_history_time" ON "contact_list_history" ("history_time");
-- create "contact_list_membership_history" table
CREATE TABLE "contact_list_membership_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "contact_list_id" character varying NOT NULL, "contact_id" character varying NOT NULL, PRIMARY KEY ("id"));
-- create index "contactlistmembershiphistory_history_time" to table: "contact_list_membership_history"
CREATE INDEX "contactlistmembershiphistory_history_time" ON "contact_list_membership_history" ("history_time");
-- create "contact_lists" table
CREATE TABLE "contact_lists" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "name" character varying NOT NULL, "visibility" character varying NOT NULL DEFAULT 'PRIVATE', "display_name" character varying NOT NULL DEFAULT '', "description" character varying NULL, "owner_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "contact_lists_organizations_contact_lists" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "contact_lists_mapping_id_key" to table: "contact_lists"
CREATE UNIQUE INDEX "contact_lists_mapping_id_key" ON "contact_lists" ("mapping_id");
-- create index "contactlist_name_owner_id" to table: "contact_lists"
CREATE UNIQUE INDEX "contactlist_name_owner_id" ON "contact_lists" ("name", "owner_id") WHERE (deleted_at IS NULL);
-- create "contact_list_memberships" table
CREATE TABLE "contact_list_memberships" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "contact_list_id" character varying NOT NULL, "contact_id" character varying NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "contact_list_memberships_contact_lists_contact_list" FOREIGN KEY ("contact_list_id") REFERENCES "contact_lists" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT "contact_list_memberships_contacts_contact" FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
-- create index "contact_list_memberships_mapping_id_key" to table: "contact_list_memberships"
CREATE UNIQUE INDEX "contact_list_memberships_mapping_id_key" ON "contact_list_memberships" ("mapping_id");
-- create index "contactlistmembership_contact_id_contact_list_id" to table: "contact_list_memberships"
CREATE UNIQUE INDEX "contactlistmembership_contact_id_contact_list_id" ON "contact_list_memberships" ("contact_id", "contact_list_id") WHERE (deleted_at IS NULL);
-- modify "events" table
ALTER TABLE "events" ADD COLUMN "contact_list_events" character varying NULL, ADD COLUMN "contact_list_membership_events" character varying NULL, ADD CONSTRAINT "events_contact_list_memberships_events" FOREIGN KEY ("contact_list_membership_events") REFERENCES "contact_list_memberships" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT "events_contact_lists_events" FOREIGN KEY ("contact_list_events") REFERENCES "contact_lists" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;
-- modify "integrations" table
ALTER TABLE "integrations" ADD COLUMN "contact_list_integrations" character varying NULL, ADD CONSTRAINT "integrations_contact_lists_integrations" FOREIGN KEY ("contact_list_integrations") REFERENCES "contact_lists" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;

-- +goose Down
-- reverse: modify "integrations" table
ALTER TABLE "integrations" DROP CONSTRAINT "integrations_contact_lists_integrations", DROP COLUMN "contact_list_integrations";
-- reverse: modify "events" table
ALTER TABLE "events" DROP CONSTRAINT "events_contact_lists_events", DROP CONSTRAINT "events_contact_list_memberships_events", DROP COLUMN "contact_list_membership_events", DROP COLUMN "contact_list_events";
-- reverse: create index "contactlistmembership_contact_id_contact_list_id" to table: "contact_list_memberships"
DROP INDEX "contactlistmembership_contact_id_contact_list_id";
-- reverse: create index "contact_list_memberships_mapping_id_key" to table: "contact_list_memberships"
DROP INDEX "contact_list_memberships_mapping_id_key";
-- reverse: create "contact_list_memberships" table
DROP TABLE "contact_list_memberships";
-- reverse: create index "contactlist_name_owner_id" to table: "contact_lists"
DROP INDEX "contactlist_name_owner_id";
-- reverse: create index "contact_lists_mapping_id_key" to table: "contact_lists"
DROP INDEX "contact_lists_mapping_id_key";
-- reverse: create "contact_lists" table
DROP TABLE "contact_lists";
-- reverse: create index "contactlistmembershiphistory_history_time" to table: "contact_list_membership_history"
DROP INDEX "contactlistmembershiphistory_history_time";
-- reverse: create "contact_list_membership_history" table
DROP TABLE "contact_list_membership_history";
-- reverse: create index "contactlisthistory_history_time" to table: "contact_list_history"
DROP INDEX "contactlisthistory_history_time";
-- reverse: create "contact_list_history" table
DROP TABLE "contact_list_history";
