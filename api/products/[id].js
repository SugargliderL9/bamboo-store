const { supabase } = require('../_lib/supabase')
const { requireAuth } = require('../_lib/auth')

module.exports = async (req, res) => {
  try {
    let { id } = req.query

    // 🔥 manejar casos donde id viene como array
    if (Array.isArray(id)) id = id[0]

    if (!id || id === 'NaN') {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'Invalid ID' }))
    }

    console.log('Updating ID:', id)

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
      return res.end(JSON.stringify({ product: data }))
    }

    // 🔐 AUTH (con await)
    if (!(await requireAuth(req, res))) return

    // ✏️ UPDATE
    if (req.method === 'PUT') {
      let body
      try {
        body = typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body
      } catch {
        res.statusCode = 400
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

      console.log('Data:', body)

      // 🔥 construir objeto limpio (sin NaN / undefined)
      const updateData = {
        name,
        imageUrl,
        description,
        price_menudeo: priceMenudeo,
        price_mayoreo: priceMayoreo,
        price_distribuidor: priceDistribuidor,
      }

      Object.keys(updateData).forEach(key => {
        if (
          updateData[key] === undefined ||
          updateData[key] === null ||
          Number.isNaN(updateData[key])
        ) {
          delete updateData[key]
        }
      })

      console.log('Payload limpio:', updateData)

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('SUPABASE ERROR:', error)
        throw error
      }

      if (!data || data.length === 0) {
        res.statusCode = 404
        return res.end(JSON.stringify({
          error: 'Product not found or not updated'
        }))
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ product: data[0] }))
    }

    // 🗑️ DELETE
    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.statusCode = 204
      return res.end()
    }

    res.statusCode = 405
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.end('Method Not Allowed')

  } catch (err) {
    console.error(err)

    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err.message }))
  }
}