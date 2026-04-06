const { listProducts, createProduct } = require('../_lib/productsStore')
const { requireAuth } = require('../_lib/auth')

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const products = await listProducts()
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ products }))
      return
    }

    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return
      const created = await createProduct(req.body)
      if (!created.ok) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: created.error }))
        return
      }
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product: created.value }))
      return
    }

    res.statusCode = 405
    res.setHeader('Allow', 'GET, POST')
    res.end('Method Not Allowed')
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'internal_error' }))
  }
}

