-- +goose Up
-- create "vendor_profile_history" table
CREATE TABLE "vendor_profile_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "vendor_id" character varying NULL, "name" character varying NOT NULL, "corporation_type" character varying NULL, "corporation_dba" character varying NULL, "description" character varying NULL, "website_uri" character varying NULL, "tax_id" character varying NULL, "tax_id_type" character varying NOT NULL DEFAULT 'UNSPECIFIED', PRIMARY KEY ("id"));
-- create index "vendorprofilehistory_history_time" to table: "vendor_profile_history"
CREATE INDEX "vendorprofilehistory_history_time" ON "vendor_profile_history" ("history_time");
-- create "phone_number_history" table
CREATE TABLE "phone_number_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "kind" character varying NOT NULL DEFAULT 'UNSPECIFIED', "region_code" character varying NULL, "short_code" character varying NULL, "number" character varying NULL, "extension" character varying NULL, PRIMARY KEY ("id"));
-- create index "phonenumberhistory_history_time" to table: "phone_number_history"
CREATE INDEX "phonenumberhistory_history_time" ON "phone_number_history" ("history_time");
-- create "vendor_profile_postal_address_history" table
CREATE TABLE "vendor_profile_postal_address_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "postal_address_type" character varying NOT NULL DEFAULT 'MAILING', "vendor_profile_id" character varying NOT NULL, "postal_address_id" character varying NOT NULL, PRIMARY KEY ("id"));
-- create index "vendorprofilepostaladdresshistory_history_time" to table: "vendor_profile_postal_address_history"
CREATE INDEX "vendorprofilepostaladdresshistory_history_time" ON "vendor_profile_postal_address_history" ("history_time");
-- create "postal_address_history" table
CREATE TABLE "postal_address_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "region_code" character varying NOT NULL, "language_code" character varying NULL, "postal_code" character varying NULL, "sorting_code" character varying NULL, "administrative_area" character varying NULL, "locality" character varying NULL, "sublocality" character varying NULL, "address_lines" jsonb NOT NULL, "recipients" jsonb NOT NULL, "organization" character varying NULL, PRIMARY KEY ("id"));
-- create index "postaladdresshistory_history_time" to table: "postal_address_history"
CREATE INDEX "postaladdresshistory_history_time" ON "postal_address_history" ("history_time");
-- create "vendor_profile_phone_number_history" table
CREATE TABLE "vendor_profile_phone_number_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "vendor_profile_id" character varying NOT NULL, "phone_number_id" character varying NOT NULL, PRIMARY KEY ("id"));
-- create index "vendorprofilephonenumberhistory_history_time" to table: "vendor_profile_phone_number_history"
CREATE INDEX "vendorprofilephonenumberhistory_history_time" ON "vendor_profile_phone_number_history" ("history_time");
-- create "vendor_history" table
CREATE TABLE "vendor_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "display_name" character varying NOT NULL, "vendor_type" character varying NOT NULL DEFAULT 'UNSPECIFIED', "onboarding_state" character varying NOT NULL DEFAULT 'PENDING', PRIMARY KEY ("id"));
-- create index "vendorhistory_history_time" to table: "vendor_history"
CREATE INDEX "vendorhistory_history_time" ON "vendor_history" ("history_time");
-- create "vendor_profile_payment_preference_history" table
CREATE TABLE "vendor_profile_payment_preference_history" ("id" character varying NOT NULL, "history_time" timestamptz NOT NULL, "ref" character varying NULL, "operation" character varying NOT NULL, "mapping_id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "tags" jsonb NULL, "owner_id" character varying NULL, "vendor_profile_id" character varying NULL, "preferred" boolean NOT NULL DEFAULT false, "method" character varying NOT NULL DEFAULT 'UNSPECIFIED', PRIMARY KEY ("id"));
-- create index "vendorprofilepaymentpreferencehistory_history_time" to table: "vendor_profile_payment_preference_history"
CREATE INDEX "vendorprofilepaymentpreferencehistory_history_time" ON "vendor_profile_payment_preference_history" ("history_time");
-- create "phone_numbers" table
CREATE TABLE "phone_numbers" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "kind" character varying NOT NULL DEFAULT 'UNSPECIFIED', "region_code" character varying NULL, "short_code" character varying NULL, "number" character varying NULL, "extension" character varying NULL, "owner_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "phone_numbers_organizations_phone_numbers" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "phone_numbers_mapping_id_key" to table: "phone_numbers"
CREATE UNIQUE INDEX "phone_numbers_mapping_id_key" ON "phone_numbers" ("mapping_id");
-- create index "phonenumber_owner_id_number" to table: "phone_numbers"
CREATE UNIQUE INDEX "phonenumber_owner_id_number" ON "phone_numbers" ("owner_id", "number");
-- create index "phonenumber_owner_id_region_code_short_code" to table: "phone_numbers"
CREATE UNIQUE INDEX "phonenumber_owner_id_region_code_short_code" ON "phone_numbers" ("owner_id", "region_code", "short_code");
-- create "postal_addresses" table
CREATE TABLE "postal_addresses" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "region_code" character varying NOT NULL, "language_code" character varying NULL, "postal_code" character varying NULL, "sorting_code" character varying NULL, "administrative_area" character varying NULL, "locality" character varying NULL, "sublocality" character varying NULL, "address_lines" jsonb NOT NULL, "recipients" jsonb NOT NULL, "organization" character varying NULL, "entity_postal_addresses" character varying NULL, "owner_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "postal_addresses_entities_postal_addresses" FOREIGN KEY ("entity_postal_addresses") REFERENCES "entities" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, CONSTRAINT "postal_addresses_organizations_postal_addresses" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "postal_addresses_mapping_id_key" to table: "postal_addresses"
CREATE UNIQUE INDEX "postal_addresses_mapping_id_key" ON "postal_addresses" ("mapping_id");
-- create index "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836" to table: "postal_addresses"
CREATE UNIQUE INDEX "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836" ON "postal_addresses" ("region_code", "locality", "sublocality", "administrative_area", "postal_code", "address_lines", "owner_id") WHERE (deleted_at IS NULL);
-- create "vendors" table
CREATE TABLE "vendors" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "display_name" character varying NOT NULL, "vendor_type" character varying NOT NULL DEFAULT 'UNSPECIFIED', "onboarding_state" character varying NOT NULL DEFAULT 'PENDING', "owner_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "vendors_organizations_vendors" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "vendor_display_name_owner_id" to table: "vendors"
CREATE UNIQUE INDEX "vendor_display_name_owner_id" ON "vendors" ("display_name", "owner_id") WHERE (deleted_at IS NULL);
-- create index "vendors_mapping_id_key" to table: "vendors"
CREATE UNIQUE INDEX "vendors_mapping_id_key" ON "vendors" ("mapping_id");
-- create "vendor_profiles" table
CREATE TABLE "vendor_profiles" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "mapping_id" character varying NOT NULL, "tags" jsonb NULL, "name" character varying NOT NULL, "corporation_type" character varying NULL, "corporation_dba" character varying NULL, "description" character varying NULL, "website_uri" character varying NULL, "tax_id" character varying NULL, "tax_id_type" character varying NOT NULL DEFAULT 'UNSPECIFIED', "owner_id" character varying NULL, "vendor_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "vendor_profiles_organizations_vendor_profiles" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, CONSTRAINT "vendor_profiles_vendors_profile" FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX "vendor_profiles_mapping_id_key" ON "vendor_profiles" ("mapping_id");
-- create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
CREATE UNIQUE INDEX "vendor_profiles_vendor_id_key" ON "vendor_profiles" ("vendor_id");
-- create index "vendorprofile_vendor_id" to table: "vendor_profiles"
CREATE UNIQUE INDEX "vendorprofile_vendor_id" ON "vendor_profiles" ("vendor_id");
-- create "vendor_profile_phone_numbers" table
CREATE TABLE "vendor_profile_phone_numbers" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "phone_number_id" character varying NOT NULL, "vendor_profile_id" character varying NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "vendor_profile_phone_numbers_phone_numbers_phone_number" FOREIGN KEY ("phone_number_id") REFERENCES "phone_numbers" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT "vendor_profile_phone_numbers_vendor_profiles_profile" FOREIGN KEY ("vendor_profile_id") REFERENCES "vendor_profiles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
-- create index "vendor_profile_phone_numbers_mapping_id_key" to table: "vendor_profile_phone_numbers"
CREATE UNIQUE INDEX "vendor_profile_phone_numbers_mapping_id_key" ON "vendor_profile_phone_numbers" ("mapping_id");
-- create index "vendorprofilephonenumber_vendor_profile_id_phone_number_id" to table: "vendor_profile_phone_numbers"
CREATE UNIQUE INDEX "vendorprofilephonenumber_vendor_profile_id_phone_number_id" ON "vendor_profile_phone_numbers" ("vendor_profile_id", "phone_number_id");
-- create "vendor_profile_postal_addresses" table
CREATE TABLE "vendor_profile_postal_addresses" ("id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "mapping_id" character varying NOT NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "postal_address_type" character varying NOT NULL DEFAULT 'MAILING', "postal_address_id" character varying NOT NULL, "vendor_profile_id" character varying NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "vendor_profile_postal_addresses_postal_addresses_postal_address" FOREIGN KEY ("postal_address_id") REFERENCES "postal_addresses" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT "vendor_profile_postal_addresses_vendor_profiles_profile" FOREIGN KEY ("vendor_profile_id") REFERENCES "vendor_profiles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
-- create index "vendor_profile_postal_addresses_mapping_id_key" to table: "vendor_profile_postal_addresses"
CREATE UNIQUE INDEX "vendor_profile_postal_addresses_mapping_id_key" ON "vendor_profile_postal_addresses" ("mapping_id");
-- create index "vendorprofilepostaladdress_vendor_profile_id_postal_address_id" to table: "vendor_profile_postal_addresses"
CREATE UNIQUE INDEX "vendorprofilepostaladdress_vendor_profile_id_postal_address_id" ON "vendor_profile_postal_addresses" ("vendor_profile_id", "postal_address_id");
-- modify "events" table
ALTER TABLE "events" ADD COLUMN "phone_number_events" character varying NULL, ADD COLUMN "postal_address_events" character varying NULL, ADD COLUMN "vendor_events" character varying NULL, ADD COLUMN "vendor_profile_phone_number_events" character varying NULL, ADD COLUMN "vendor_profile_postal_address_events" character varying NULL, ADD CONSTRAINT "events_phone_numbers_events" FOREIGN KEY ("phone_number_events") REFERENCES "phone_numbers" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT "events_postal_addresses_events" FOREIGN KEY ("postal_address_events") REFERENCES "postal_addresses" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT "events_vendor_profile_phone_numbers_events" FOREIGN KEY ("vendor_profile_phone_number_events") REFERENCES "vendor_profile_phone_numbers" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT "events_vendor_profile_postal_addresses_events" FOREIGN KEY ("vendor_profile_postal_address_events") REFERENCES "vendor_profile_postal_addresses" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT "events_vendors_events" FOREIGN KEY ("vendor_events") REFERENCES "vendors" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;
-- create "vendor_profile_payment_preferences" table
CREATE TABLE "vendor_profile_payment_preferences" ("id" character varying NOT NULL, "mapping_id" character varying NOT NULL, "created_at" timestamptz NULL, "updated_at" timestamptz NULL, "created_by" character varying NULL, "updated_by" character varying NULL, "deleted_at" timestamptz NULL, "deleted_by" character varying NULL, "tags" jsonb NULL, "preferred" boolean NOT NULL DEFAULT false, "method" character varying NOT NULL DEFAULT 'UNSPECIFIED', "owner_id" character varying NULL, "vendor_profile_id" character varying NULL, PRIMARY KEY ("id"), CONSTRAINT "vendor_profile_payment_prefere_dea359c5a56a125244e4bfbb3c58e063" FOREIGN KEY ("owner_id") REFERENCES "organizations" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, CONSTRAINT "vendor_profile_payment_prefere_e3505e26af02e9e6b9954ff843a5335c" FOREIGN KEY ("vendor_profile_id") REFERENCES "vendor_profiles" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX "vendor_profile_payment_preferences_mapping_id_key" ON "vendor_profile_payment_preferences" ("mapping_id");
-- create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
CREATE UNIQUE INDEX "vendorprofilepaymentpreference_vendor_profile_id_preferred" ON "vendor_profile_payment_preferences" ("vendor_profile_id", "preferred");

-- +goose Down
-- reverse: create index "vendorprofilepaymentpreference_vendor_profile_id_preferred" to table: "vendor_profile_payment_preferences"
DROP INDEX "vendorprofilepaymentpreference_vendor_profile_id_preferred";
-- reverse: create index "vendor_profile_payment_preferences_mapping_id_key" to table: "vendor_profile_payment_preferences"
DROP INDEX "vendor_profile_payment_preferences_mapping_id_key";
-- reverse: create "vendor_profile_payment_preferences" table
DROP TABLE "vendor_profile_payment_preferences";
-- reverse: modify "events" table
ALTER TABLE "events" DROP CONSTRAINT "events_vendors_events", DROP CONSTRAINT "events_vendor_profile_postal_addresses_events", DROP CONSTRAINT "events_vendor_profile_phone_numbers_events", DROP CONSTRAINT "events_postal_addresses_events", DROP CONSTRAINT "events_phone_numbers_events", DROP COLUMN "vendor_profile_postal_address_events", DROP COLUMN "vendor_profile_phone_number_events", DROP COLUMN "vendor_events", DROP COLUMN "postal_address_events", DROP COLUMN "phone_number_events";
-- reverse: create index "vendorprofilepostaladdress_vendor_profile_id_postal_address_id" to table: "vendor_profile_postal_addresses"
DROP INDEX "vendorprofilepostaladdress_vendor_profile_id_postal_address_id";
-- reverse: create index "vendor_profile_postal_addresses_mapping_id_key" to table: "vendor_profile_postal_addresses"
DROP INDEX "vendor_profile_postal_addresses_mapping_id_key";
-- reverse: create "vendor_profile_postal_addresses" table
DROP TABLE "vendor_profile_postal_addresses";
-- reverse: create index "vendorprofilephonenumber_vendor_profile_id_phone_number_id" to table: "vendor_profile_phone_numbers"
DROP INDEX "vendorprofilephonenumber_vendor_profile_id_phone_number_id";
-- reverse: create index "vendor_profile_phone_numbers_mapping_id_key" to table: "vendor_profile_phone_numbers"
DROP INDEX "vendor_profile_phone_numbers_mapping_id_key";
-- reverse: create "vendor_profile_phone_numbers" table
DROP TABLE "vendor_profile_phone_numbers";
-- reverse: create index "vendorprofile_vendor_id" to table: "vendor_profiles"
DROP INDEX "vendorprofile_vendor_id";
-- reverse: create index "vendor_profiles_vendor_id_key" to table: "vendor_profiles"
DROP INDEX "vendor_profiles_vendor_id_key";
-- reverse: create index "vendor_profiles_mapping_id_key" to table: "vendor_profiles"
DROP INDEX "vendor_profiles_mapping_id_key";
-- reverse: create "vendor_profiles" table
DROP TABLE "vendor_profiles";
-- reverse: create index "vendors_mapping_id_key" to table: "vendors"
DROP INDEX "vendors_mapping_id_key";
-- reverse: create index "vendor_display_name_owner_id" to table: "vendors"
DROP INDEX "vendor_display_name_owner_id";
-- reverse: create "vendors" table
DROP TABLE "vendors";
-- reverse: create index "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836" to table: "postal_addresses"
DROP INDEX "postaladdress_region_code_loca_3fab0940843357dc49670b3d42b3a836";
-- reverse: create index "postal_addresses_mapping_id_key" to table: "postal_addresses"
DROP INDEX "postal_addresses_mapping_id_key";
-- reverse: create "postal_addresses" table
DROP TABLE "postal_addresses";
-- reverse: create index "phonenumber_owner_id_region_code_short_code" to table: "phone_numbers"
DROP INDEX "phonenumber_owner_id_region_code_short_code";
-- reverse: create index "phonenumber_owner_id_number" to table: "phone_numbers"
DROP INDEX "phonenumber_owner_id_number";
-- reverse: create index "phone_numbers_mapping_id_key" to table: "phone_numbers"
DROP INDEX "phone_numbers_mapping_id_key";
-- reverse: create "phone_numbers" table
DROP TABLE "phone_numbers";
-- reverse: create index "vendorprofilepaymentpreferencehistory_history_time" to table: "vendor_profile_payment_preference_history"
DROP INDEX "vendorprofilepaymentpreferencehistory_history_time";
-- reverse: create "vendor_profile_payment_preference_history" table
DROP TABLE "vendor_profile_payment_preference_history";
-- reverse: create index "vendorhistory_history_time" to table: "vendor_history"
DROP INDEX "vendorhistory_history_time";
-- reverse: create "vendor_history" table
DROP TABLE "vendor_history";
-- reverse: create index "vendorprofilephonenumberhistory_history_time" to table: "vendor_profile_phone_number_history"
DROP INDEX "vendorprofilephonenumberhistory_history_time";
-- reverse: create "vendor_profile_phone_number_history" table
DROP TABLE "vendor_profile_phone_number_history";
-- reverse: create index "postaladdresshistory_history_time" to table: "postal_address_history"
DROP INDEX "postaladdresshistory_history_time";
-- reverse: create "postal_address_history" table
DROP TABLE "postal_address_history";
-- reverse: create index "vendorprofilepostaladdresshistory_history_time" to table: "vendor_profile_postal_address_history"
DROP INDEX "vendorprofilepostaladdresshistory_history_time";
-- reverse: create "vendor_profile_postal_address_history" table
DROP TABLE "vendor_profile_postal_address_history";
-- reverse: create index "phonenumberhistory_history_time" to table: "phone_number_history"
DROP INDEX "phonenumberhistory_history_time";
-- reverse: create "phone_number_history" table
DROP TABLE "phone_number_history";
-- reverse: create index "vendorprofilehistory_history_time" to table: "vendor_profile_history"
DROP INDEX "vendorprofilehistory_history_time";
-- reverse: create "vendor_profile_history" table
DROP TABLE "vendor_profile_history";
