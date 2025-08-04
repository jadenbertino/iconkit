alter table "public"."icon" drop column "version";

alter table "public"."icon" add column "build_id" text not null;


