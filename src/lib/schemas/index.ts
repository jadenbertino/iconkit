import { z } from 'zod'

const PaginationSchema = z.object({
  skip: z.coerce.number().min(0),
  limit: z.coerce.number().min(1),
})
type Pagination = z.infer<typeof PaginationSchema>

export { PaginationSchema }
export type { Pagination }
