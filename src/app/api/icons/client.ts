import { http } from '@/lib/clients/client'
import { GetResponseSchema } from './schema'

async function getIcons() {
  const { icons } = await http.get({
    url: '/api/icons',
    responseSchema: GetResponseSchema,
  })
  return icons
}

export { getIcons }
