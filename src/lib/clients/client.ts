import { createClient } from '@supabase/supabase-js'
import { CLIENT_ENV } from '../../env/client'
import { HttpClient } from '../http'
import type { Database } from '../schemas/database.types'

const supabase = createClient<Database>(
  CLIENT_ENV.SUPABASE_URL,
  CLIENT_ENV.SUPABASE_ANON_KEY,
)
const http = new HttpClient()

export { http, supabase }
