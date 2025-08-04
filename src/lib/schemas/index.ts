import { MAX_LIMIT, MAX_SKIP } from '@/constants/query'
import { z } from 'zod'

const PaginationSchema = z.object({
  skip: z.coerce.number().min(0).max(MAX_SKIP),
  limit: z.coerce.number().min(1).max(MAX_LIMIT),
})
type Pagination = z.infer<typeof PaginationSchema>

export { PaginationSchema }
export type { Pagination }
