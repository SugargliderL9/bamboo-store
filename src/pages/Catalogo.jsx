// src/pages/Catalogo.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../lib/api'

const Catalogo = () => {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setStatus('loading')
        setError('')
        const items = await listProducts()
        if (!mounted) return
        setProducts(items)
        setStatus('ready')
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'error')
        setStatus('error')
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const content = useMemo(() => {
    if (status === 'loading') return <p className="helper">Cargando productos…</p>
    if (status === 'error') return <p className="helper">Error: {error}</p>
    if (!products.length) return <p className="helper">Aún no hay productos.</p>

    return (
      <div className="catalogo-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/producto/${product.id}`}
            className="catalogo-item"
            style={{ textDecoration: 'none', color: '#fff' }}
          >
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
          </Link>
        ))}
      </div>
    )
  }, [error, products, status])

  return (
    <div className="styled-catalogo">
      <h1>Catálogo</h1>
      {content}
    </div>
  )
}

export default Catalogo
