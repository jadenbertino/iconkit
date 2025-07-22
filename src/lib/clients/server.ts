import { SERVER_ENV } from '@/env/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../schemas/database.types'
import { DopplerSDK } from '@dopplerhq/node-sdk'

const supabaseAdmin = createClient<Database>(
  SERVER_ENV.SUPABASE_URL,
  SERVER_ENV.SUPABASE_SERVICE_ROLE_KEY,
)

const doppler = new DopplerSDK({
  accessToken: SERVER_ENV.DOPPLER_TOKEN,
})

export { supabaseAdmin, doppler }
