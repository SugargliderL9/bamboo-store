const { createClient } = require('@supabase/supabase-js')

function getSupabaseClient(req) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY, // 👈 anon key
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )
}

// 📦 LISTAR
async function listProducts(req) {
  const supabase = getSupabaseClient(req)

  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) throw error
  return data
}

// ➕ CREAR
async function createProduct(req, body) {
  const supabase = getSupabaseClient(req)

  const { data, error } = await supabase
    .from('products')
    .insert([body])
    .select()
    .single()

  if (error) return { ok: false, error: error.message }

  return { ok: true, value: data }
}

module.exports = {
  listProducts,
  createProduct,
}