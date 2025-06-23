import { z } from 'zod'
import { CLIENT_ENV } from './client'

const serverSchema = z.object({
  // AWS
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  S3_BUCKET_NAME: z.string(),
})

const serverValidation = serverSchema.safeParse(process.env)

if (!serverValidation.success) {
  console.error(
    '❌ Invalid server environment variables:',
    serverValidation.error.flatten().fieldErrors,
  )
  throw new Error('Invalid server environment variables')
}

const SERVER_ENV = {
  ...serverValidation.data,
  ...CLIENT_ENV, // all client env vars are also available on the server
}

export { SERVER_ENV }
