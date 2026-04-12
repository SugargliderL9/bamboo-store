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
      return res.end(JSON.stringify({ products: data }))
    }

    // 🔹 POST
    if (req.method === 'POST') {
      // ✅ Asegurar await por si es async
      if (!(await requireAuth(req, res))) return

      // ✅ Parse seguro del body
      let body
      try {
        body = typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body
      } catch {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }

      const {
        name,
        imageUrl,
        description,
        priceMenudeo,
        priceMayoreo,
        priceDistribuidor
      } = body || {}

      // ✅ Validación básica
      if (!name || !priceMenudeo) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({
          error: 'Missing required fields (name, priceMenudeo)'
        }))
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name,
            imageUrl,
            description,
            price_menudeo: priceMenudeo,
            price_mayoreo: priceMayoreo,
            price_distribuidor: priceDistribuidor,
          }
        ])
        .select()

      if (error) throw error

      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({
        product: data?.[0] || null
      }))
    }

    // 🔹 Método no permitido
    res.statusCode = 405
    res.setHeader('Allow', ['GET', 'POST'])
    return res.end('Method Not Allowed')

  } catch (err) {
    console.error(err)

    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({
      error: err.message || 'Internal Server Error'
    }))
  }
}