alter table "public"."license" add column "provider_id" bigint;

alter table "public"."license" add constraint "license_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES provider(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."license" validate constraint "license_provider_id_fkey";


