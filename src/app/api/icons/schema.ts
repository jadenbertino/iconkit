import { IconSchema } from '@/constants'
import { z } from 'zod'

const GetResponseSchema = z.object({
  icons: z.array(IconSchema),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetResponseSchema }
export type { GetResponse }
