// src/pages/Cotizacion.jsx
import React from "react"
import { useQuoteCart } from "../context/QuoteCartContext"
import "../style/Cotizacion.scss"

const Cotizacion = () => {
  const {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    priceType,
    setPriceType,
  } = useQuoteCart()

  const getPrice = (product) => {
    if (priceType === "mayoreo") return product.price_mayoreo
    if (priceType === "distribuidor") return product.price_distribuidor
    return product.price_menudeo
  }

  const total = items.reduce(
    (acc, p) => acc + (getPrice(p) * p.quantity || 0),
    0
  )

  return (
    <div className="cotizacion-page">
      <h1>Cotización</h1>

      <div className="cotizacion-container">

        {/* selector */}
        <select
          className="select-price"
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
        >
          <option value="menudeo">Menudeo</option>
          <option value="mayoreo">Mayoreo</option>
          <option value="distribuidor">Distribuidor</option>
        </select>

        {items.length === 0 && <p>No hay productos.</p>}

        {items.map((item) => (
          <div key={item.id} className="cotizacion-item">
            <h3>{item.name}</h3>

            {/* 🔢 CONTROLES */}
            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => addToCart(item)}>+</button>
            </div>

            <p>
              ${(getPrice(item) * item.quantity).toLocaleString()}
            </p>

            <button
              className="btn btn-remove"
              onClick={() => removeFromCart(item.id)}
            >
              Quitar
            </button>
          </div>
        ))}

        <div className="cotizacion-actions">
          <h2 className="total">
            Total: ${total.toLocaleString()}
          </h2>

          <button className="btn btn-clear" onClick={clearCart}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cotizacion