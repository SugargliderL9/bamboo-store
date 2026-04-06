import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
)
console.log('SUPABASE URL:', process.env.SUPABASE_URL)
console.log('SUPABASE KEY:', process.env.SUPABASE_KEY ? 'OK' : 'MISSING')