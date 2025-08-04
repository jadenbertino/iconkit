import {
  DELIMITERS,
  MAX_SEARCH_LENGTH,
  MAX_SEARCH_TERMS,
} from '@/constants/query'
import { PaginationSchema } from '@/lib/schemas'
import { IconSchema } from '@/lib/schemas/database'
import { z } from 'zod'

const SearchTextSchema = z
  .string()
  .transform((text) => {
    if (!text) return text
    const trimmedText = text.slice(0, MAX_SEARCH_LENGTH)
    const terms = trimmedText
      .trim()
      .split(DELIMITERS)
      .filter((term) => term.length > 0)
    return terms.slice(0, MAX_SEARCH_TERMS).join(' ')
  })
  .nullable()

const GetRequestSchema = PaginationSchema.extend({
  searchText: SearchTextSchema,
})

const GetResponseSchema = z.object({
  icons: z.array(IconSchema.Row),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetRequestSchema, GetResponseSchema }
export type { GetResponse }
