import { z } from 'zod'

const clientSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
})

const getClientEnv = () => {
  const clientEnv: Record<string, string | undefined> = {}

  for (const key of Object.keys(clientSchema.shape)) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      clientEnv[key] = process.env[key]
    }
  }

  return clientEnv
}

const clientValidation = clientSchema.safeParse(getClientEnv())

if (!clientValidation.success) {
  console.error(
    '❌ Invalid client environment variables:',
    clientValidation.error.flatten().fieldErrors,
  )
  throw new Error('Invalid client environment variables')
}

const CLIENT_ENV = clientValidation.data

export { CLIENT_ENV }
