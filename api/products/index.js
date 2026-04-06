const { supabase } = require('../_lib/supabase')
const { requireAuth } = require('../_lib/auth')

module.exports = async (req, res) => {
  try {
    // 🔹 GET
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ products: data }))
      return
    }

    // 🔹 POST
    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return

      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body

      const { name, price, imageUrl, description } = body

      const { data, error } = await supabase
        .from('products')
        .insert([
          { name, price, image_url: imageUrl, description }
        ])
        .select()

      if (error) throw error

      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product: data[0] }))
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