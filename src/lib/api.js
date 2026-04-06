import { supabase } from './supabase'

// 🔥 Helper para hacer requests
async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (res.status === 204) return null

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.error || `request_failed_${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

// 🔐 Obtener headers con token de Supabase
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const token = session?.access_token

  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}

// 📦 LISTAR PRODUCTOS
export async function listProducts() {
  const data = await request('/api/products')
  return data.products
}

// 🔍 OBTENER UNO
export async function getProduct(id) {
  const data = await request(`/api/products/${encodeURIComponent(id)}`)
  return data.product
}

// ➕ CREAR PRODUCTO
export async function createProduct(product) {
  const headers = await getAuthHeaders()

  const data = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
    headers,
  })

  return data.product
}

// ✏️ ACTUALIZAR PRODUCTO
export async function updateProduct(id, product) {
  const headers = await getAuthHeaders()

  const data = await request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
    headers,
  })

  return data.product
}

// 🗑️ ELIMINAR PRODUCTO
export async function deleteProduct(id) {
  const headers = await getAuthHeaders()

  await request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  })
}