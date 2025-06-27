import { z } from 'zod'

const PaginationSchema = z.object({
  skip: z.coerce.number().min(0),
  limit: z.coerce.number().min(1),
})

export { PaginationSchema }
