-- +goose Up
-- disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- create "new_vendor_profiles" table
CREATE TABLE `new_vendor_profiles` (`id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `mapping_id` text NOT NULL, `tags` json NULL, `name` text NOT NULL, `corporation_type` text NULL, `corporation_dba` text NULL, `description` text NULL, `website_uri` text NULL, `tax_id` text NULL, `tax_id_type` text NOT NULL DEFAULT ('UNSPECIFIED'), `owner_id` text NULL, `vendor_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profiles_organizations_vendor_profiles` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL, CONSTRAINT `vendor_profiles_vendors_profile` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE);
-- copy rows from old table "vendor_profiles" to new temporary table "new_vendor_profiles"
INSERT INTO `new_vendor_profiles` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `mapping_id`, `tags`, `name`, `corporation_type`, `corporation_dba`, `description`, `website_uri`, `tax_id`, `tax_id_type`, `owner_id`, `vendor_id`) SELECT `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `mapping_id`, `tags`, `name`, `corporation_type`, `corporation_dba`, `description`, `website_uri`, `tax_id`, `tax_id_type`, `owner_id`, `vendor_id` FROM `vendor_profiles`;
-- drop "vendor_profiles" table after copying rows
DROP TABLE `vendor_profiles`;
-- rename temporary table "new_vendor_profiles" to "vendor_profiles"
ALTER TABLE `new_vendor_profiles` RENAME TO `vendor_profiles`;
-- create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendor_profiles_mapping_id_key` ON `vendor_profiles` (`mapping_id`);
-- create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendor_profiles_vendor_id_key` ON `vendor_profiles` (`vendor_id`);
-- create index "vendorprofile_vendor_id" to table: "vendor_profiles"
CREATE UNIQUE INDEX `vendorprofile_vendor_id` ON `vendor_profiles` (`vendor_id`);
-- create "new_vendor_profile_payment_preferences" table
CREATE TABLE `new_vendor_profile_payment_preferences` (`id` text NOT NULL, `mapping_id` text NOT NULL, `created_at` datetime NULL, `updated_at` datetime NULL, `created_by` text NULL, `updated_by` text NULL, `deleted_at` datetime NULL, `deleted_by` text NULL, `tags` json NULL, `preferred` bool NOT NULL DEFAULT (false), `method` text NOT NULL DEFAULT ('UNSPECIFIED'), `owner_id` text NULL, `vendor_profile_id` text NULL, PRIMARY KEY (`id`), CONSTRAINT `vendor_profile_payment_prefere_dea359c5a56a125244e4bfbb3c58e063` FOREIGN KEY (`owner_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL, CONSTRAINT `vendor_profile_payment_prefere_e3505e26af02e9e6b9954ff843a5335c` FOREIGN KEY (`vendor_profile_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE CASCADE);
-- copy rows from old table "vendor_profile_payment_preferences" to new temporary table "new_vendor_profile_payment_preferences"
INSERT INTO `new_vendor_profile_payment_preferences` (`id`, `mapping_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `tags`, `preferred`, `method`, `owner_id`, `vendor_profile_id`) SELECT `id`, `mapping_id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`, `tags`, `preferred`, `method`, `owner_id`, `vendor_profile_id` FROM `vendor_profile_payment_preferences`;
-- drop "vendor_profile_payment_preferences" table after copying rows
DROP TABLE `vendor_profile_payment_preferences`;
-- rename temporary table "new_vendor_profile_payment_preferences" to "vendor_profile_payment_preferences"
ALTER TABLE `new_vendor_profile_payment_preferences` RENAME TO `vendor_profile_payment_preferences`;
-- create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX `vendor_profile_payment_preferences_mapping_id_key` ON `vendor_profile_payment_preferences` (`mapping_id`);
-- create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX `vendorprofilepaymentpreference_vendor_profile_id_preferred` ON `vendor_profile_payment_preferences` (`vendor_profile_id`, `preferred`);
-- enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;

-- +goose Down
-- reverse: create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
DROP INDEX `vendorprofilepaymentpreference_vendor_profile_id_preferred`;
-- reverse: create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
DROP INDEX `vendor_profile_payment_preferences_mapping_id_key`;
-- reverse: create "new_vendor_profile_payment_preferences" table
DROP TABLE `new_vendor_profile_payment_preferences`;
-- reverse: create index "vendorprofile_vendor_id" to table: "vendor_profiles"
DROP INDEX `vendorprofile_vendor_id`;
-- reverse: create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
DROP INDEX `vendor_profiles_vendor_id_key`;
-- reverse: create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
DROP INDEX `vendor_profiles_mapping_id_key`;
-- reverse: create "new_vendor_profiles" table
DROP TABLE `new_vendor_profiles`;
