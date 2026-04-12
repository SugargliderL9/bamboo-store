// src/pages/Producto.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "../style/Producto.scss"
import { getProduct } from "../lib/api";

const Producto = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setStatus('loading')
        setError('')
        const item = await getProduct(id)
        if (!mounted) return
        setProduct(item)
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
  }, [id])

  if (status === 'loading') return <div className="producto-page"><p>Cargando…</p></div>
  if (status === 'error') return <div className="producto-page"><p>Error: {error}</p></div>
  if (!product) return <h2>Producto no encontrado</h2>

  return (
    <div className="producto-page">
      <img src={product.imageUrl} alt={product.name} />
      <h1>{product.name}</h1>

      {/* 🔥 PRECIOS BONITOS */}
      <div className="prices">
  <div className="price-options">
    <p>Menudeo: ${product.price_menudeo?.toLocaleString()}</p>
    <p>Mayoreo: ${product.price_mayoreo?.toLocaleString()}</p>
    <p>Distribuidor: ${product.price_distribuidor?.toLocaleString()}</p>
  </div>
</div>

      <p className="description">{product.description}</p>

      <Link to="/catalogo" className="back-button">
        Volver al Catálogo
      </Link>
    </div>
  )
}

export default Producto