import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function listProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data
}

async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

async function createProduct(body) {
  const { data, error } = await supabase
    .from('products')
    .insert([body])
    .select()

  if (error) return { ok: false, error: error.message }
  return { ok: true, value: data[0] }
}

async function updateProduct(id, body) {
  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .select()

  if (error) return { ok: false, error: error.message }
  return { ok: true, value: data[0] }
}

async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}