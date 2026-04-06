const { getProduct, updateProduct, deleteProduct } = require('../_lib/productsStore')
const { requireAuth } = require('../_lib/auth')

module.exports = async (req, res) => {
  try {
    const { id } = req.query || {}

    if (req.method === 'GET') {
      const product = await getProduct(id)
      if (!product) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'not_found' }))
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product }))
      return
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return
      const updated = await updateProduct(id, req.body)
      if (!updated.ok) {
        res.statusCode = updated.status || 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: updated.error }))
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ product: updated.value }))
      return
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return
      const deleted = await deleteProduct(id)
      if (!deleted.ok) {
        res.statusCode = deleted.status || 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: deleted.error }))
        return
      }
      res.statusCode = 204
      res.end()
      return
    }

    res.statusCode = 405
    res.setHeader('Allow', 'GET, PUT, DELETE')
    res.end('Method Not Allowed')
  } catch {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'internal_error' }))
  }
}

