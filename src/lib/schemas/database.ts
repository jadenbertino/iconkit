import * as _ from './_database'

const IconSchema = {
  Row: _.iconRowSchema,
  Insert: _.iconInsertSchema,
  Update: _.iconUpdateSchema,
  Relationships: _.iconRelationshipsSchema,
}

const ProviderSchema = {
  Row: _.providerRowSchema,
  Insert: _.providerInsertSchema,
  Update: _.providerUpdateSchema,
}

export { IconSchema, ProviderSchema }
