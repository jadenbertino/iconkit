import { SERVER_ENV } from '@/env/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schemas/database.types'

const supabaseAdmin = createClient<Database>(
  SERVER_ENV.SUPABASE_URL,
  SERVER_ENV.SUPABASE_SERVICE_ROLE_KEY,
)

export { supabaseAdmin }
