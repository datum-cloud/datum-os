-- +goose Up
-- disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- create "new_events" table
CREATE TABLE `new_events` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `event_id` text NULL, `correlation_id` text NULL, `event_type` text NOT NULL, `metadata` json NULL, `contact_list_events` text NULL, `contact_list_membership_events` text NULL, `phone_number_events` text NULL, `postal_address_events` text NULL, `vendor_events` text NULL, `vendor_profile_phone_number_events` text NULL, `vendor_profile_postal_address_events` text NULL, PRIMARY KEY (`id`), CONSTRAINT `events_contact_lists_events` FOREIGN KEY (`contact_list_events`) REFERENCES `contact_lists` (`id`) ON DELETE SET NULL, CONSTRAINT `events_contact_list_memberships_events` FOREIGN KEY (`contact_list_membership_events`) REFERENCES `contact_list_memberships` (`id`) ON DELETE SET NULL, CONSTRAINT `events_phone_numbers_events` FOREIGN KEY (`phone_number_events`) REFERENCES `phone_numbers` (`id`) ON DELETE SET NULL, CONSTRAINT `events_postal_addresses_events` FOREIGN KEY (`postal_address_events`) REFERENCES `postal_addresses` (`id`) ON DELETE SET NULL, CONSTRAINT `events_vendors_events` FOREIGN KEY (`vendor_events`) REFERENCES `vendors` (`id`) ON DELETE SET NULL, CONSTRAINT `events_vendor_profile_phone_numbers_events` FOREIGN KEY (`vendor_profile_phone_number_events`) REFERENCES `vendor_profile_phone_numbers` (`id`) ON DELETE SET NULL, CONSTRAINT `events_vendor_profile_postal_addresses_events` FOREIGN KEY (`vendor_profile_postal_address_events`) REFERENCES `vendor_profile_postal_addresses` (`id`) ON DELETE SET NULL);
-- copy rows from old table "events" to new temporary table "new_events"
INSERT INTO `new_events` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `event_id`, `correlation_id`, `event_type`, `metadata`, `contact_list_events`, `contact_list_membership_events`) SELECT `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `mapping_id`, `tags`, `event_id`, `correlation_id`, `event_type`, `metadata`, `contact_list_events`, `contact_list_membership_events` FROM `events`;
-- drop "events" table after copying rows
DROP TABLE `events`;
-- rename temporary table "new_events" to "events"
ALTER TABLE `new_events` RENAME TO `events`;
-- create index "events_mapping_id_key" to table: "events"
CREATE UNIQUE INDEX `events_mapping_id_key` ON `events` (`mapping_id`);
-- create "phone_numbers" table
CREATE TABLE `phone_numbers` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `kind` text NOT NULL DEFAULT ('UNSPECIFIED'), `region_code` text NULL, `short_code` text NULL, `number` text NULL, `extension` text NULL, `owner_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `phone_numbers_organizations_phone_numbers` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL);
-- create index "phone_numbers_mapping_id_key" to table: "phone_numbers"
CREATE UNIQUE INDEX `phone_numbers_mapping_id_key` ON `phone_numbers` (`mapping_id`);
-- create index "phonenumber_owner_id_region_code_short_code" to table: "phone_numbers"
CREATE UNIQUE INDEX `phonenumber_owner_id_region_code_short_code` ON `phone_numbers` (`owner_id`, `region_code`, `short_code`);
-- create index "phonenumber_owner_id_number" to table: "phone_numbers"
CREATE UNIQUE INDEX `phonenumber_owner_id_number` ON `phone_numbers` (`owner_id`, `number`);
-- create "phone_number_history" table
CREATE TABLE `phone_number_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `owner_id` text NULL, `kind` text NOT NULL DEFAULT ('UNSPECIFIED'), `region_code` text NULL, `short_code` text NULL, `number` text NULL, `extension` text NULL, PRIMARY KEY (`id`));
-- create index "phonenumberhistory_history_time" to table: "phone_number_history"
CREATE INDEX `phonenumberhistory_history_time` ON `phone_number_history` (`history_time`);
-- create "postal_addresses" table
CREATE TABLE `postal_addresses` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `region_code` text NOT NULL, `language_code` text NULL, `postal_code` text NULL, `sorting_code` text NULL, `administrative_area` text NULL, `locality` text NULL, `sublocality` text NULL, `address_lines` json NOT NULL, `recipients` json NOT NULL, `organization` text NULL, `entity_postal_addresses` text NULL, `owner_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `postal_addresses_entities_postal_addresses` FOREIGN KEY (`entity_postal_addresses`) REFERENCES `entities` (`id`) ON DELETE SET NULL, CONSTRAINT `postal_addresses_organizations_postal_addresses` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL);
-- create index "postal_addresses_mapping_id_key" to table: "postal_addresses"
CREATE UNIQUE INDEX `postal_addresses_mapping_id_key` ON `postal_addresses` (`mapping_id`);
-- create index "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836" to table: "postal_addresses"
CREATE UNIQUE INDEX `postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836` ON `postal_addresses` (`region_code`, `locality`, `sublocality`, `administrative_area`, `postal_code`, `address_lines`, `owner_id`) WHERE deleted_at is NULL;
-- create "postal_address_history" table
CREATE TABLE `postal_address_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `owner_id` text NULL, `region_code` text NOT NULL, `language_code` text NULL, `postal_code` text NULL, `sorting_code` text NULL, `administrative_area` text NULL, `locality` text NULL, `sublocality` text NULL, `address_lines` json NOT NULL, `recipients` json NOT NULL, `organization` text NULL, PRIMARY KEY (`id`));
-- create index "postaladdresshistory_history_time" to table: "postal_address_history"
CREATE INDEX `postaladdresshistory_history_time` ON `postal_address_history` (`history_time`);
-- create "vendors" table
CREATE TABLE `vendors` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `display_name` text NOT NULL, `vendor_type` text NOT NULL DEFAULT ('UNSPECIFIED'), `onboarding_state` text NOT NULL DEFAULT ('PENDING'), `owner_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `vendors_organizations_vendors` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL);
-- create index "vendors_mapping_id_key" to table: "vendors"
CREATE UNIQUE INDEX `vendors_mapping_id_key` ON `vendors` (`mapping_id`);
-- create index "vendor_display_name_owner_id" to table: "vendors"
CREATE UNIQUE INDEX `vendor_display_name_owner_id` ON `vendors` (`display_name`, `owner_id`) WHERE deleted_at is NULL;
-- create "vendor_history" table
CREATE TABLE `vendor_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `owner_id` text NULL, `display_name` text NOT NULL, `vendor_type` text NOT NULL DEFAULT ('UNSPECIFIED'), `onboarding_state` text NOT NULL DEFAULT ('PENDING'), PRIMARY KEY (`id`));
-- create index "vendorhistory_history_time" to table: "vendor_history"
CREATE INDEX `vendorhistory_history_time` ON `vendor_history` (`history_time`);
-- create "vendor_profiles" table
CREATE TABLE `vendor_profiles` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `name` text NOT NULL, `corporation_type` text NULL, `corporation_dba` text NULL, `description` text NULL, `website_uri` text NULL, `tax_id` text NULL, `tax_id_type` text NOT NULL DEFAULT ('UNSPECIFIED'), `owner_id` text NULL, `vendor_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profiles_organizations_vendor_profiles` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL, CONSTRAINT `vendor_profiles_vendors_profile` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE SET NULL);
-- create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendor_profiles_mapping_id_key` ON `vendor_profiles` (`mapping_id`);
-- create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendor_profiles_vendor_id_key` ON `vendor_profiles` (`vendor_id`);
-- create index "vendorprofile_vendor_id" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendorprofile_vendor_id` ON `vendor_profiles` (`vendor_id`);
-- create "vendor_profile_history" table
CREATE TABLE `vendor_profile_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `owner_id` text NULL, `vendor_id` text NULL, `name` text NOT NULL, `corporation_type` text NULL, `corporation_dba` text NULL, `description` text NULL, `website_uri` text NULL, `tax_id` text NULL, `tax_id_type` text NOT NULL DEFAULT ('UNSPECIFIED'), PRIMARY KEY (`id`));
-- create index "vendorprofilehistory_history_time" to table: "vendor_profile_history"
CREATE INDEX `vendorprofilehistory_history_time` ON `vendor_profile_history` (`history_time`);
-- create "vendor_profile_payment_preferences" table
CREATE TABLE `vendor_profile_payment_preferences` (`id` text NOT NULL, `mapping_id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `tags` json NULL, `preferred` bool NOT NULL DEFAULT (false), `method` text NOT NULL DEFAULT ('UNSPECIFIED'), `owner_id` text NULL, `vendor_profile_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profile_payment_prefere_dea359c5a56a125244e4bfbb3c58e063` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL, CONSTRAINT `vendor_profile_payment_prefere_e3505e26af02e9e6b9954ff843a5335c` FOREIGN KEY (`vendor_profile_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE SET NULL);
-- create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX `vendor_profile_payment_preferences_mapping_id_key` ON `vendor_profile_payment_preferences` (`mapping_id`);
-- create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX `vendorprofilepaymentpreference_vendor_profile_id_preferred` ON `vendor_profile_payment_preferences` (`vendor_profile_id`, `preferred`);
-- create "vendor_profile_payment_preference_history" table
CREATE TABLE `vendor_profile_payment_preference_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `mapping_id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `tags` json NULL, `owner_id` text NULL, `vendor_profile_id` text NULL, `preferred` bool NOT NULL DEFAULT (false), `method` text NOT NULL DEFAULT ('UNSPECIFIED'), PRIMARY KEY (`id`));
-- create index "vendorprofilepaymentpreferencehistory_history_time" to table: "vendor_profile_payment_preference_history"
CREATE INDEX `vendorprofilepaymentpreferencehistory_history_time` ON `vendor_profile_payment_preference_history` (`history_time`);
-- create "vendor_profile_phone_numbers" table
CREATE TABLE `vendor_profile_phone_numbers` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `phone_number_id` text NOT NULL, `vendor_profile_id` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profile_phone_numbers_phone_numbers_phone_number` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_numbers` (`id`) ON DELETE NO ACTION, CONSTRAINT `vendor_profile_phone_numbers_vendor_profiles_profile` FOREIGN KEY (`vendor_profile_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE NO ACTION);
-- create index "vendor_profile_phone_numbers_mapping_id_key" to table: "vendor_profile_phone_numbers"
CREATE UNIQUE INDEX `vendor_profile_phone_numbers_mapping_id_key` ON `vendor_profile_phone_numbers` (`mapping_id`);
-- create index "vendorprofilephonenumber_vendor_profile_id_phone_number_id" to table: "vendor_profile_phone_numbers"
CREATE UNIQUE INDEX `vendorprofilephonenumber_vendor_profile_id_phone_number_id` ON `vendor_profile_phone_numbers` (`vendor_profile_id`, `phone_number_id`);
-- create "vendor_profile_phone_number_history" table
CREATE TABLE `vendor_profile_phone_number_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `vendor_profile_id` text NOT NULL, `phone_number_id` text NOT NULL, PRIMARY KEY (`id`));
-- create index "vendorprofilephonenumberhistory_history_time" to table: "vendor_profile_phone_number_history"
CREATE INDEX `vendorprofilephonenumberhistory_history_time` ON `vendor_profile_phone_number_history` (`history_time`);
-- create "vendor_profile_postal_addresses" table
CREATE TABLE `vendor_profile_postal_addresses` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `postal_address_type` text NOT NULL DEFAULT ('MAILING'), `postal_address_id` text NOT NULL, `vendor_profile_id` text NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profile_postal_addresses_postal_addresses_postal_address` FOREIGN KEY (`postal_address_id`) REFERENCES `postal_addresses` (`id`) ON DELETE NO ACTION, CONSTRAINT `vendor_profile_postal_addresses_vendor_profiles_profile` FOREIGN KEY (`vendor_profile_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE NO ACTION);
-- create index "vendor_profile_postal_addresses_mapping_id_key" to table: "vendor_profile_postal_addresses"
CREATE UNIQUE INDEX `vendor_profile_postal_addresses_mapping_id_key` ON `vendor_profile_postal_addresses` (`mapping_id`);
-- create index "vendorprofilepostaladdress_vendor_profile_id_postal_address_id" to table: "vendor_profile_postal_addresses"
CREATE UNIQUE INDEX `vendorprofilepostaladdress_vendor_profile_id_postal_address_id` ON `vendor_profile_postal_addresses` (`vendor_profile_id`, `postal_address_id`);
-- create "vendor_profile_postal_address_history" table
CREATE TABLE `vendor_profile_postal_address_history` (`id` text NOT NULL, `history_time` datetime NOT NULL, `ref` text NULL, `operation` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `mapping_id` text NOT NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `postal_address_type` text NOT NULL DEFAULT ('MAILING'), `vendor_profile_id` text NOT NULL, `postal_address_id` text NOT NULL, PRIMARY KEY (`id`));
-- create index "vendorprofilepostaladdresshistory_history_time" to table: "vendor_profile_postal_address_history"
CREATE INDEX `vendorprofilepostaladdresshistory_history_time` ON `vendor_profile_postal_address_history` (`history_time`);
-- enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;

-- +goose Down
-- reverse: create index "vendorprofilepostaladdresshistory_history_time" to table: "vendor_profile_postal_address_history"
DROP INDEX `vendorprofilepostaladdresshistory_history_time`;
-- reverse: create "vendor_profile_postal_address_history" table
DROP TABLE `vendor_profile_postal_address_history`;
-- reverse: create index "vendorprofilepostaladdress_vendor_profile_id_postal_address_id" to table: "vendor_profile_postal_addresses"
DROP INDEX `vendorprofilepostaladdress_vendor_profile_id_postal_address_id`;
-- reverse: create index "vendor_profile_postal_addresses_mapping_id_key" to table: "vendor_profile_postal_addresses"
DROP INDEX `vendor_profile_postal_addresses_mapping_id_key`;
-- reverse: create "vendor_profile_postal_addresses" table
DROP TABLE `vendor_profile_postal_addresses`;
-- reverse: create index "vendorprofilephonenumberhistory_history_time" to table: "vendor_profile_phone_number_history"
DROP INDEX `vendorprofilephonenumberhistory_history_time`;
-- reverse: create "vendor_profile_phone_number_history" table
DROP TABLE `vendor_profile_phone_number_history`;
-- reverse: create index "vendorprofilephonenumber_vendor_profile_id_phone_number_id" to table: "vendor_profile_phone_numbers"
DROP INDEX `vendorprofilephonenumber_vendor_profile_id_phone_number_id`;
-- reverse: create index "vendor_profile_phone_numbers_mapping_id_key" to table: "vendor_profile_phone_numbers"
DROP INDEX `vendor_profile_phone_numbers_mapping_id_key`;
-- reverse: create "vendor_profile_phone_numbers" table
DROP TABLE `vendor_profile_phone_numbers`;
-- reverse: create index "vendorprofilepaymentpreferencehistory_history_time" to table: "vendor_profile_payment_preference_history"
DROP INDEX `vendorprofilepaymentpreferencehistory_history_time`;
-- reverse: create "vendor_profile_payment_preference_history" table
DROP TABLE `vendor_profile_payment_preference_history`;
-- reverse: create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
DROP INDEX `vendorprofilepaymentpreference_vendor_profile_id_preferred`;
-- reverse: create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
DROP INDEX `vendor_profile_payment_preferences_mapping_id_key`;
-- reverse: create "vendor_profile_payment_preferences" table
DROP TABLE `vendor_profile_payment_preferences`;
-- reverse: create index "vendorprofilehistory_history_time" to table: "vendor_profile_history"
DROP INDEX `vendorprofilehistory_history_time`;
-- reverse: create "vendor_profile_history" table
DROP TABLE `vendor_profile_history`;
-- reverse: create index "vendorprofile_vendor_id" to table: "vendor_profiles"
DROP INDEX `vendorprofile_vendor_id`;
-- reverse: create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
DROP INDEX `vendor_profiles_vendor_id_key`;
-- reverse: create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
DROP INDEX `vendor_profiles_mapping_id_key`;
-- reverse: create "vendor_profiles" table
DROP TABLE `vendor_profiles`;
-- reverse: create index "vendorhistory_history_time" to table: "vendor_history"
DROP INDEX `vendorhistory_history_time`;
-- reverse: create "vendor_history" table
DROP TABLE `vendor_history`;
-- reverse: create index "vendor_display_name_owner_id" to table: "vendors"
DROP INDEX `vendor_display_name_owner_id`;
-- reverse: create index "vendors_mapping_id_key" to table: "vendors"
DROP INDEX `vendors_mapping_id_key`;
-- reverse: create "vendors" table
DROP TABLE `vendors`;
-- reverse: create index "postaladdresshistory_history_time" to table: "postal_address_history"
DROP INDEX `postaladdresshistory_history_time`;
-- reverse: create "postal_address_history" table
DROP TABLE `postal_address_history`;
-- reverse: create index "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836" to table: "postal_addresses"
DROP INDEX `postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836`;
-- reverse: create index "postal_addresses_mapping_id_key" to table: "postal_addresses"
DROP INDEX `postal_addresses_mapping_id_key`;
-- reverse: create "postal_addresses" table
DROP TABLE `postal_addresses`;
-- reverse: create index "phonenumberhistory_history_time" to table: "phone_number_history"
DROP INDEX `phonenumberhistory_history_time`;
-- reverse: create "phone_number_history" table
DROP TABLE `phone_number_history`;
-- reverse: create index "phonenumber_owner_id_number" to table: "phone_numbers"
DROP INDEX `phonenumber_owner_id_number`;
-- reverse: create index "phonenumber_owner_id_region_code_short_code" to table: "phone_numbers"
DROP INDEX `phonenumber_owner_id_region_code_short_code`;
-- reverse: create index "phone_numbers_mapping_id_key" to table: "phone_numbers"
DROP INDEX `phone_numbers_mapping_id_key`;
-- reverse: create "phone_numbers" table
DROP TABLE `phone_numbers`;
-- reverse: create index "events_mapping_id_key" to table: "events"
DROP INDEX `events_mapping_id_key`;
-- reverse: create "new_events" table
DROP TABLE `new_events`;
