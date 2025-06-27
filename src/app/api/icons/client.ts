import { http } from '@/lib/clients/client'
import { z } from 'zod'
import { GetRequestSchema, GetResponseSchema } from './schema'

type IconQuery = z.infer<typeof GetRequestSchema>

async function getIcons(query: IconQuery) {
  const { icons } = await http.get({
    url: '/api/icons',
    params: query,
    responseSchema: GetResponseSchema,
  })
  return icons
}

export { getIcons }
export type { IconQuery }
