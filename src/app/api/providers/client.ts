import { http } from '@/lib/clients/client'
import { GetResponseSchema } from './schema'

async function getProviders() {
  const { providers } = await http.get({
    url: '/api/providers',
    responseSchema: GetResponseSchema,
  })
  return providers
}

export { getProviders }