-- +goose Up
-- modify "organization_history" table
ALTER TABLE "organization_history" ADD COLUMN "avatar_local_file" character varying NULL;
-- modify "organizations" table
ALTER TABLE "organizations" ADD COLUMN "avatar_local_file" character varying NULL;

-- +goose Down
-- reverse: modify "organizations" table
ALTER TABLE "organizations" DROP COLUMN "avatar_local_file";
-- reverse: modify "organization_history" table
ALTER TABLE "organization_history" DROP COLUMN "avatar_local_file";
