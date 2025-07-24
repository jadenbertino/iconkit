import { z } from 'zod'
import * as _ from './_database'

const IconSchema = {
  Row: _.iconRowSchema,
  Insert: _.iconInsertSchema,
  Update: _.iconUpdateSchema,
  Relationships: _.iconRelationshipsSchema,
}
type Icon = z.infer<typeof IconSchema.Row>
type ScrapedIcon = Omit<
  z.infer<typeof IconSchema.Insert>,
  'provider_id' | 'created_at' | 'tags'
>

const ProviderSchema = {
  Row: _.providerRowSchema,
  Insert: _.providerInsertSchema,
  Update: _.providerUpdateSchema,
}
type Provider = z.infer<typeof ProviderSchema.Row>

const LicenseSchema = {
  Row: _.licenseRowSchema,
  Insert: _.licenseInsertSchema,
  Update: _.licenseUpdateSchema,
}
type License = z.infer<typeof LicenseSchema.Row>
type ScrapedLicense = Omit<
  z.infer<typeof LicenseSchema.Insert>,
  'id' | 'created_at'
>

export { IconSchema, LicenseSchema, ProviderSchema }
export type { Icon, License, Provider, ScrapedIcon, ScrapedLicense }
