import { createClient } from '@supabase/supabase-js'
import { CLIENT_ENV } from '../../env/client'
import { HttpClient } from '../http'
import type { Database } from '../types/database.types'

const supabasePublic = createClient<Database>(
  CLIENT_ENV.SUPABASE_URL,
  CLIENT_ENV.SUPABASE_ANON_KEY,
)
const http = new HttpClient()

export { http, supabasePublic }
