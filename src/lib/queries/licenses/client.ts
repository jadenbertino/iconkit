import { MAX_LICENSES } from '@/constants/query'
import { supabase } from '@/lib/clients/client'

async function getLicenses() {
  const { data } = await supabase
    .from('license')
    .select('*')
    .limit(MAX_LICENSES)
    .throwOnError()

  return data
}

export { getLicenses }