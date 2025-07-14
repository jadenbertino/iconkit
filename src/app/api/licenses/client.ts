import { http } from '@/lib/clients/client'
import { GetResponseSchema } from './schema'

async function getLicenses() {
  const { licenses } = await http.get({
    url: '/api/licenses',
    responseSchema: GetResponseSchema,
  })
  return licenses
}

export { getLicenses }