import { IconSchema } from '@/lib/schemas/database'
import { z } from 'zod'

const GetResponseSchema = z.object({
  icons: z.array(IconSchema.Row),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetResponseSchema }
export type { GetResponse }
