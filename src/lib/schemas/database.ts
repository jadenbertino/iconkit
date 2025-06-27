import { z } from 'zod'
import * as _ from './_database'

const IconSchema = {
  Row: _.iconRowSchema,
  Insert: _.iconInsertSchema,
  Update: _.iconUpdateSchema,
  Relationships: _.iconRelationshipsSchema,
}
type Icon = z.infer<typeof IconSchema.Row>

const ProviderSchema = {
  Row: _.providerRowSchema,
  Insert: _.providerInsertSchema,
  Update: _.providerUpdateSchema,
}
type Provider = z.infer<typeof ProviderSchema.Row>

export { IconSchema, ProviderSchema }
export type { Icon, Provider }
