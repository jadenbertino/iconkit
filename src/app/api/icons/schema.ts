import { PaginationSchema } from '@/lib/schemas'
import { IconSchema } from '@/lib/schemas/database'
import { z } from 'zod'

const GetRequestSchema = PaginationSchema.extend({
  searchText: z.string(),
})

const GetResponseSchema = z.object({
  icons: z.array(IconSchema.Row),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetRequestSchema, GetResponseSchema }
export type { GetResponse }
