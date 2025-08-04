import { LicenseSchema } from '@/lib/schemas/database'
import { z } from 'zod'

const GetResponseSchema = z.object({
  licenses: z.array(LicenseSchema.Row),
})
type GetResponse = z.infer<typeof GetResponseSchema>

export { GetResponseSchema }
export type { GetResponse }
