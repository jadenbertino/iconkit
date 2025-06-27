### schema updates

- [ ] Change `provider.id` to be a `string` (enum) that matches `ICON_PROVIDER_IDS`
  - [ ] Also adjust `icon.provider_id` to be a `string` (enum)
  - [ ] Create a `seed.sql` file that can be used to populate the table with the default providers (refer to `ICON_PROVIDERS`)

### RLS updates

- [ ] `icon` table
  - [ ] Anon can select
  - [ ] Service role can insert update delete
- [ ] `provider` table
  - [ ] Anon can select
  - [ ] Service role can insert update delete
