create policy "Enable read access for all users"
on "public"."icon"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."license"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."provider"
as permissive
for select
to public
using (true);



