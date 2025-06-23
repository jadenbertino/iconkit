import { z } from 'zod'
import { CLIENT_ENV } from './client'

function validateServerEnv() {
  const serverSchema = z.object({
    // TODO: add stuff here
  })

  const serverValidation = serverSchema.safeParse(process.env)

  if (!serverValidation.success) {
    console.error(
      '❌ Invalid server environment variables:',
      serverValidation.error.flatten().fieldErrors,
    )
    throw new Error('Invalid server environment variables')
  }

  return {
    ...serverValidation.data,
    ...CLIENT_ENV, // all client env vars are also available on the server
  }
}

const SERVER_ENV = validateServerEnv()

export { SERVER_ENV }
