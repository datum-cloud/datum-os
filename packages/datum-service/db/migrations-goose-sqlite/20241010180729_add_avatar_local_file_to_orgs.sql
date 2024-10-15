-- +goose Up
-- add column "avatar_local_file" to table: "organizations"
ALTER TABLE `organizations` ADD COLUMN `avatar_local_file` text NULL;
-- add column "avatar_local_file" to table: "organization_history"
ALTER TABLE `organization_history` ADD COLUMN `avatar_local_file` text NULL;

-- +goose Down
-- reverse: add column "avatar_local_file" to table: "organization_history"
ALTER TABLE `organization_history` DROP COLUMN `avatar_local_file`;
-- reverse: add column "avatar_local_file" to table: "organizations"
ALTER TABLE `organizations` DROP COLUMN `avatar_local_file`;
