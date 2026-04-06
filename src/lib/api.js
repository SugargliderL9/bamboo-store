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

export async function listProducts() {
  const data = await request('/api/products')
  return data.products // 👈 👈 👈 ESTA ES LA CLAVE
}

export async function getProduct(id) {
  const data = await request(`/api/products/${encodeURIComponent(id)}`)
  return data.product
}

export async function createProduct(product, adminToken) {
  const data = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
  })
  return data.product
}

export async function updateProduct(id, product, adminToken) {
  const data = await request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
  })
  return data.product
}

export async function deleteProduct(id, adminToken) {
  await request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
  })
}

