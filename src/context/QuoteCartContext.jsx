// src/context/QuoteCartContext.jsx
import React, { createContext, useContext, useState } from "react"

const QuoteCartContext = createContext()

export const QuoteCartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [priceType, setPriceType] = useState("menudeo")

  // ➕ agregar producto
  const addToCart = (product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id)

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // ➖ disminuir cantidad
  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    )
  }

  // ❌ eliminar producto completo
  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  const clearCart = () => setItems([])

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        priceType,
        setPriceType,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  )
}

export const useQuoteCart = () => useContext(QuoteCartContext)