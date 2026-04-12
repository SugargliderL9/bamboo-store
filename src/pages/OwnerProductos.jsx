import React, { useEffect, useMemo, useState } from 'react'
import {
  createProduct as apiCreateProduct,
  deleteProduct as apiDeleteProduct,
  listProducts as apiListProducts,
  updateProduct as apiUpdateProduct,
} from '../lib/api'

const EMPTY_FORM = {
  name: '',
  imageUrl: '',
  priceMenudeo: '',
  priceMayoreo: '',
  priceDistribuidor: '',
  description: '',
}

function toForm(product) {
  return {
    name: product?.name ?? '',
    imageUrl: product?.imageUrl ?? '',
    priceMenudeo: product?.price_menudeo ?? '',
    priceMayoreo: product?.price_mayoreo ?? '',
    priceDistribuidor: product?.price_distribuidor ?? '',
    description: product?.description ?? '',
  }
}

function toPayload(form) {
  return {
    name: String(form.name || '').trim(),
    imageUrl: String(form.imageUrl || '').trim(),
    priceMenudeo: Number(form.priceMenudeo),
    priceMayoreo: Number(form.priceMayoreo),
    priceDistribuidor: Number(form.priceDistribuidor),
    description: String(form.description || '').trim(),
  }
}

const OwnerProductos = () => {
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

  const canSubmit = useMemo(() => {
    const payload = toPayload(form)
    return (
      payload.name &&
      payload.imageUrl &&
      Number.isFinite(payload.priceMenudeo) &&
      payload.priceMenudeo >= 0
    )
  }, [form])

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = toPayload(form)

      if (mode === 'create') {
        await apiCreateProduct(payload)
      } else {
        await apiUpdateProduct(editingId, payload)
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
      await apiDeleteProduct(id)
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

      setForm((f) => ({
        ...f,
        imageUrl: data.secure_url,
      }))

      setError('')
    } catch {
      setError('Error subiendo imagen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="styled-owner-productos">
      <h1>Owner · Productos</h1>

      <div className="owner-grid">
        {/* FORM */}
        <section className="panel">
          <h2>{mode === 'create' ? 'Agregar producto' : `Editar producto #${editingId}`}</h2>

          <form onSubmit={onSubmit} className="form">

            {/* NOMBRE */}
            <label className="field">
              <span>Nombre</span>
              <input
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </label>

            {/* IMAGEN */}
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

            {/* PRECIOS */}
            <label className="field">
              <span>Precios</span>

              <input
                type="number"
                placeholder="Menudeo"
                value={form.priceMenudeo}
                onChange={(e) => setForm(f => ({ ...f, priceMenudeo: e.target.value }))}
              />

              <input
                type="number"
                placeholder="Mayoreo"
                value={form.priceMayoreo}
                onChange={(e) => setForm(f => ({ ...f, priceMayoreo: e.target.value }))}
              />

              <input
                type="number"
                placeholder="Distribuidor"
                value={form.priceDistribuidor}
                onChange={(e) => setForm(f => ({ ...f, priceDistribuidor: e.target.value }))}
              />
            </label>

            {/* DESCRIPCIÓN */}
            <label className="field">
              <span>Descripción</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="actions">
              <button type="submit" disabled={!canSubmit || saving}>
                {saving ? 'Guardando…' : mode === 'create' ? 'Agregar' : 'Guardar'}
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

        {/* LISTADO */}
        <section className="panel">
          <h2>Listado</h2>

          {status === 'loading' && <p>Cargando…</p>}
          {status === 'error' && <p>Error: {error}</p>}

          <div className="table">
            {products.map((p) => (
              <div key={p.id} className="row">
                <img src={p.imageUrl} alt={p.name} style={{ width: '60px' }} />
                <div>{p.name}</div>

                <div>
                  <small>M: ${p.price_menudeo}</small><br />
                  <small>May: ${p.price_mayoreo}</small><br />
                  <small>Dist: ${p.price_distribuidor}</small>
                </div>

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