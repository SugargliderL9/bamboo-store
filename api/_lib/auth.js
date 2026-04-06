const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function requireAuth(req, res) {
  const header = req.headers?.authorization || ''
  const token = header.startsWith('Bearer ')
    ? header.slice('Bearer '.length)
    : null

  if (!token) {
    res.statusCode = 401
    res.end(JSON.stringify({ error: 'no_token' }))
    return null
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    res.statusCode = 401
    res.end(JSON.stringify({ error: 'invalid_token' }))
    return null
  }

  return data.user
}

module.exports = { requireAuth }