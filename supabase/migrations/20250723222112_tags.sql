alter table "public"."icon" add column "tags" text[];

alter table "public"."provider" drop column "git_branch";

alter table "public"."provider" drop column "git_icons_dir";


