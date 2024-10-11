-- Modify "organization_history" table
ALTER TABLE "organization_history" ADD COLUMN "avatar_local_file" character varying NULL;
-- Modify "organizations" table
ALTER TABLE "organizations" ADD COLUMN "avatar_local_file" character varying NULL;
