import { supabase } from '@/lib/clients/client'

async function getLicenses() {
  const { data } = await supabase
    .from('license')
    .select('*')
    .throwOnError()

  return data
}

export { getLicenses }