import React, { useEffect, useMemo, useState } from 'react'
import {
  createProduct as apiCreateProduct,
  deleteProduct as apiDeleteProduct,
  listProducts as apiListProducts,
  updateProduct as apiUpdateProduct,
} from '../lib/api'

const EMPTY_FORM = { name: '', imageUrl: '', price: '', description: '' }

function toForm(product) {
  return {
    name: product?.name ?? '',
    imageUrl: product?.imageUrl ?? '',
    price: product?.price ?? '',
    description: product?.description ?? '',
  }
}

function toPayload(form) {
  return {
    name: String(form.name || '').trim(),
    imageUrl: String(form.imageUrl || '').trim(),
    price: Number(form.price),
    description: String(form.description || '').trim(),
  }
}

const OwnerProductos = () => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ADMIN_TOKEN') || '')
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const [mode, setMode] = useState('create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function refresh() {
    setStatus('loading')
    setError('')
    try {
      const items = await apiListProducts()
      setProducts(Array.isArray(items) ? items : [])
      setStatus('ready')
    } catch (e) {
      setError(e?.message || 'error')
      setStatus('error')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    localStorage.setItem('ADMIN_TOKEN', adminToken)
  }, [adminToken])

  const canSubmit = useMemo(() => {
    const payload = toPayload(form)
    return payload.name && payload.imageUrl && Number.isFinite(payload.price) && payload.price >= 0
  }, [form])

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = toPayload(form)
      if (mode === 'create') {
        await apiCreateProduct(payload, adminToken)
      } else {
        await apiUpdateProduct(editingId, payload, adminToken)
      }
      setForm(EMPTY_FORM)
      setMode('create')
      setEditingId(null)
      await refresh()
    } catch (e2) {
      setError(e2?.message || 'error')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(p) {
    setMode('edit')
    setEditingId(p.id)
    setForm(toForm(p))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setMode('create')
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function remove(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    setSaving(true)
    setError('')
    try {
      await apiDeleteProduct(id, adminToken)
      await refresh()
    } catch (e) {
      setError(e?.message || 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setSaving(true)
    setError('Subiendo imagen...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'productos')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dv1g8prq7/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()
      console.log(data)
      setForm((f) => ({
        ...f,
        imageUrl: data.secure_url,
      }))

      setError('')
    } catch (err) {
      setError('Error subiendo imagen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="styled-owner-productos">
      <h1>Owner · Productos</h1>

      <div className="owner-grid">
        <section className="panel">
          <h2>{mode === 'create' ? 'Agregar producto' : `Editar producto #${editingId}`}</h2>

          <label className="field">
            <span>Admin token</span>
            <input
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="ADMIN_TOKEN"
            />
          </label>

          <form onSubmit={onSubmit} className="form">
            <label className="field">
              <span>Nombre</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ej. Cartera"
              />
            </label>

            {/* 🔥 CLOUDINARY */}
            <label className="field">
              <span>Imagen</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  style={{ width: '80px', marginTop: '10px', borderRadius: '8px' }}
                />
              )}
            </label>

            <label className="field">
              <span>Precio</span>
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="$$$"
              />
            </label>

            <label className="field">
              <span>Descripción</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="actions">
              <button type="submit" disabled={!canSubmit || saving}>
                {saving ? 'Guardando…' : mode === 'create' ? 'Agregar' : 'Guardar cambios'}
              </button>

              {mode === 'edit' && (
                <button type="button" onClick={cancelEdit}>
                  Cancelar
                </button>
              )}

              <button type="button" onClick={refresh}>
                Recargar
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>Listado</h2>

          {status === 'loading' && <p>Cargando…</p>}
          {status === 'error' && <p>Error: {error}</p>}

          <div className="table">
            {products.map((p) => (
              <div key={p.id} className="row">
                <img src={p.imageUrl} alt={p.name} style={{ width: '60px' }} />
                <div>{p.name}</div>
                <div>${p.price}</div>

                <button onClick={() => startEdit(p)}>Editar</button>
                <button onClick={() => remove(p.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default OwnerProductos