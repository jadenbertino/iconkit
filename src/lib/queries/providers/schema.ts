import { ProviderSchema } from '@/lib/schemas/database'
import { z } from 'zod'

const GetResponseSchema = z.object({
  providers: z.array(ProviderSchema.Row),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetResponseSchema }
export type { GetResponse }