-- +goose Up
-- disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- create "new_events" table
CREATE TABLE `new_events` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `event_id` text NULL, `correlation_id` text NULL, `event_type` text NOT NULL, `metadata` json NULL, `contact_list_events` text NULL, `contact_list_membership_events` text NULL, PRIMARY KEY (`id`), CONSTRAINT `events_contact_lists_events` FOREIGN KEY (`contact_list_events`) REFERENCES `contact_lists` (`id`) ON DELETE SET NULL, CONSTRAINT `events_contact_list_memberships_events` FOREIGN KEY (`contact_list_membership_events`) REFERENCES `contact_list_memberships` (`id`) ON DELETE SET NULL);
-- copy rows from old table "events" to new temporary table "new_events"
INSERT INTO `new_events` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `event_id`, `correlation_id`, `event_type`, `metadata`) SELECT `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `event_id`, `correlation_id`, `event_type`, `metadata` FROM `events`;
-- drop "events" table after copying rows
DROP TABLE `events`;
-- rename temporary table "new_events" to "events"
ALTER TABLE `new_events` RENAME TO `events`;
-- create index "events_mapping_id_key" to table: "events"
CREATE UNIQUE INDEX `events_mapping_id_key` ON `events` (`mapping_id`);
-- create "new_integrations" table
CREATE TABLE `new_integrations` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `name` text NOT NULL, `description` text NULL, `kind` text NULL, `contact_list_integrations` text NULL, `group_integrations` text NULL, `owner_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `integrations_contact_lists_integrations` FOREIGN KEY (`contact_list_integrations`) REFERENCES `contact_lists` (`id`) ON DELETE SET NULL, CONSTRAINT `integrations_groups_integrations` FOREIGN KEY (`group_integrations`) REFERENCES `groups` (`id`) ON DELETE SET NULL, CONSTRAINT `integrations_organizations_integrations` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL);
-- copy rows from old table "integrations" to new temporary table "new_integrations"
INSERT INTO `new_integrations` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `deleted_at`, `deleted_by`, `name`, `description`, `kind`, `group_integrations`, `owner_id`) SELECT `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `deleted_at`, `deleted_by`, `name`, `description`, `kind`, `group_integrations`, `owner_id` FROM `integrations`;
-- drop "integrations" table after copying rows
DROP TABLE `integrations`;
-- rename temporary table "new_integrations" to "integrations"
ALTER TABLE `new_integrations` RENAME TO `integrations`;
-- create index "integrations_mapping_id_key" to table: "integrations"
CREATE UNIQUE INDEX `integrations_mapping_id_key` ON `integrations` (`mapping_id`);
-- create "contact_lists" table
CREATE TABLE `contact_lists` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `name` text NOT NULL, `visibility` text NOT NULL DEFAULT ('PRIVATE'), `display_name` text NOT NULL DEFAULT (''), `description` text NULL, `owner_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `contact_lists_organizations_contact_lists` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL);
-- create index "contact_lists_mapping_id_key" to table: "contact_lists"
CREATE UNIQUE INDEX `contact_lists_mapping_id_key` ON `contact_lists` (`mapping_id`);
-- create index "contactlist_name_owner_id" to table: "contact_lists"
CREATE UNIQUE INDEX `contactlist_name_owner_id` ON `contact_lists` (`name`, `owner_id`) WHERE deleted_at is NULL;
-- create "contact_list_history" table
CREATE TABLE `contact_list_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `owner_id` text NULL, `name` text NOT NULL, `visibility` text NOT NULL DEFAULT ('PRIVATE'), `display_name` text NOT NULL DEFAULT (''), `description` text NULL, PRIMARY KEY (`id`));
-- create index "contactlisthistory_history_time" to table: "contact_list_history"
CREATE INDEX `contactlisthistory_history_time` ON `contact_list_history` (`history_time`);
-- create "contact_list_memberships" table
CREATE TABLE `contact_list_memberships` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `contact_list_id` text NOT NULL, `contact_id` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `contact_list_memberships_contact_lists_contact_list` FOREIGN KEY (`contact_list_id`) REFERENCES `contact_lists` (`id`) ON DELETE NO ACTION, CONSTRAINT `contact_list_memberships_contacts_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE NO ACTION);
-- create index "contact_list_memberships_mapping_id_key" to table: "contact_list_memberships"
CREATE UNIQUE INDEX `contact_list_memberships_mapping_id_key` ON `contact_list_memberships` (`mapping_id`);
-- create index "contactlistmembership_contact_id_contact_list_id" to table: "contact_list_memberships"
CREATE UNIQUE INDEX `contactlistmembership_contact_id_contact_list_id` ON `contact_list_memberships` (`contact_id`, `contact_list_id`) WHERE deleted_at is NULL;
-- create "contact_list_membership_history" table
CREATE TABLE `contact_list_membership_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `contact_list_id` text NOT NULL, `contact_id` text NOT NULL, PRIMARY KEY (`id`));
-- create index "contactlistmembershiphistory_history_time" to table: "contact_list_membership_history"
CREATE INDEX `contactlistmembershiphistory_history_time` ON `contact_list_membership_history` (`history_time`);
-- enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;

-- +goose Down
-- reverse: create index "contactlistmembershiphistory_history_time" to table: "contact_list_membership_history"
DROP INDEX `contactlistmembershiphistory_history_time`;
-- reverse: create "contact_list_membership_history" table
DROP TABLE `contact_list_membership_history`;
-- reverse: create index "contactlistmembership_contact_id_contact_list_id" to table: "contact_list_memberships"
DROP INDEX `contactlistmembership_contact_id_contact_list_id`;
-- reverse: create index "contact_list_memberships_mapping_id_key" to table: "contact_list_memberships"
DROP INDEX `contact_list_memberships_mapping_id_key`;
-- reverse: create "contact_list_memberships" table
DROP TABLE `contact_list_memberships`;
-- reverse: create index "contactlisthistory_history_time" to table: "contact_list_history"
DROP INDEX `contactlisthistory_history_time`;
-- reverse: create "contact_list_history" table
DROP TABLE `contact_list_history`;
-- reverse: create index "contactlist_name_owner_id" to table: "contact_lists"
DROP INDEX `contactlist_name_owner_id`;
-- reverse: create index "contact_lists_mapping_id_key" to table: "contact_lists"
DROP INDEX `contact_lists_mapping_id_key`;
-- reverse: create "contact_lists" table
DROP TABLE `contact_lists`;
-- reverse: create index "integrations_mapping_id_key" to table: "integrations"
DROP INDEX `integrations_mapping_id_key`;
-- reverse: create "new_integrations" table
DROP TABLE `new_integrations`;
-- reverse: create index "events_mapping_id_key" to table: "events"
DROP INDEX `events_mapping_id_key`;
-- reverse: create "new_events" table
DROP TABLE `new_events`;
