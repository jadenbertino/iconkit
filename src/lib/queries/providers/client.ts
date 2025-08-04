import { MAX_PROVIDERS } from '@/constants/query'
import { supabase } from '@/lib/clients/client'

async function getProviders() {
  const { data } = await supabase
    .from('provider')
    .select('*')
    .order('name')
    .limit(MAX_PROVIDERS)
    .throwOnError()

  return data
}

export { getProviders }