import { supabase } from '@/lib/clients/client'

async function getProviders() {
  const { data } = await supabase
    .from('provider')
    .select('*')
    .order('name')
    .throwOnError()

  return data
}

export { getProviders }