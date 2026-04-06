const { supabase } = require('../_lib/supabase')
const { requireAuth } = require('../_lib/auth')

module.exports = async (req, res) => {
  try {
    const { id } = req.query

    // 🔍 GET ONE
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product: data }))
      return
    }

    // 🔐 PROTEGER
    if (!requireAuth(req, res)) return

    // ✏️ UPDATE
    if (req.method === 'PUT') {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body

      const { name, price, imageUrl, description } = body

      const { data, error } = await supabase
        .from('products')
        .update({
          name,
          price,
          imageUrl,
          description,
        })
        .eq('id', id)
        .select()

      if (error) throw error

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product: data[0] }))
      return
    }

    // 🗑️ DELETE
    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.statusCode = 204
      res.end()
      return
    }

    res.statusCode = 405
    res.end('Method Not Allowed')

  } catch (err) {
    console.error(err)

    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err.message }))
  }
}