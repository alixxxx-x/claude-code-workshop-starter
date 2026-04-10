import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, createProduct, updateProduct, deleteProduct, getMe } from '../lib/api'

const CATEGORIES = [
  { key: 'dermo_cosmetics', label: 'Dermo-cosmetics' },
  { key: 'baby_care', label: 'Baby care' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'orthopedics', label: 'Orthopedics' },
  { key: 'wound_care', label: 'Wound care' },
  { key: 'oral_hygiene', label: 'Oral hygiene' },
  { key: 'hair_care', label: 'Hair care' },
  { key: 'wellness_devices', label: 'Wellness' },
]

const STOCK_OPTIONS = [
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
  { key: 'out', label: 'Out of stock' },
]

const EMPTY_FORM = {
  name: '', brand: '', category: 'dermo_cosmetics',
  price_dzd: '', wholesale_price_dzd: '',
  stock_level: 'medium', is_b2b_listed: false, photo_url: '',
}

const STOCK_COLOR = { high: 'text-emerald-600', medium: 'text-yellow-600', low: 'text-orange-600', out: 'text-red-500' }

export default function PharmacistCatalogue() {
  const [products, setProducts] = useState([])
  const [pharmacyId, setPharmacyId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().then(u => {
      if (u?.pharmacy) {
        setPharmacyId(u.pharmacy)
        getProducts({ pharmacy: u.pharmacy }).then(data => {
          setProducts(Array.isArray(data) ? data : [])
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  function openNew() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(p) {
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price_dzd: p.price_dzd, wholesale_price_dzd: p.wholesale_price_dzd || '',
      stock_level: p.stock_level, is_b2b_listed: p.is_b2b_listed, photo_url: p.photo_url,
    })
    setEditId(p.id)
    setShowForm(true)
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price_dzd: parseInt(form.price_dzd),
      wholesale_price_dzd: form.wholesale_price_dzd ? parseInt(form.wholesale_price_dzd) : null,
    }
    const data = editId
      ? await updateProduct(editId, payload)
      : await createProduct(payload)
    if (data?.id) {
      if (editId) {
        setProducts(ps => ps.map(p => p.id === data.id ? data : p))
      } else {
        setProducts(ps => [data, ...ps])
      }
      setShowForm(false)
    }
    setSaving(false)
  }

  async function remove(id) {
    await deleteProduct(id)
    setProducts(ps => ps.filter(p => p.id !== id))
  }

  async function toggleStock(p) {
    const newLevel = p.stock_level === 'out' ? 'medium' : 'out'
    const updated = await updateProduct(p.id, { stock_level: newLevel })
    if (updated?.id) setProducts(ps => ps.map(x => x.id === updated.id ? updated : x))
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist/dashboard" className="text-emerald-600 text-sm hover:underline">← Dashboard</Link>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-800">Catalogue</span>
        </div>
        <button onClick={openNew} className="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition">
          + Add product
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!pharmacyId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            Your account is not linked to a pharmacy yet. Please contact support.
          </div>
        )}

        {/* Add/Edit form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-20 flex items-end justify-center">
            <div className="bg-white rounded-t-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">{editId ? 'Edit product' : 'Add product'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">×</button>
              </div>

              <form onSubmit={save} className="space-y-3">
                {[
                  { key: 'name', label: 'Product name', required: true },
                  { key: 'brand', label: 'Brand' },
                  { key: 'photo_url', label: 'Photo URL' },
                ].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required={required}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retail price (DZD)</label>
                    <input type="number" value={form.price_dzd} onChange={e => setForm(f => ({ ...f, price_dzd: e.target.value }))} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale price (optional)</label>
                    <input type="number" value={form.wholesale_price_dzd} onChange={e => setForm(f => ({ ...f, wholesale_price_dzd: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock level</label>
                  <select value={form.stock_level} onChange={e => setForm(f => ({ ...f, stock_level: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {STOCK_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_b2b_listed} onChange={e => setForm(f => ({ ...f, is_b2b_listed: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-700">List on inter-pharmacy exchange</span>
                </label>

                <button type="submit" disabled={saving}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editId ? 'Save changes' : 'Add product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">Your catalogue is empty.</p>
            <button onClick={openNew} className="text-emerald-600 text-sm hover:underline mt-2 inline-block">Add your first product →</button>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-gray-700">{p.price_dzd.toLocaleString()} DZD</span>
                      <span className={`text-xs font-medium ${STOCK_COLOR[p.stock_level]}`}>
                        {p.stock_level === 'out' ? 'Out of stock' : p.stock_level}
                      </span>
                      {p.is_b2b_listed && <span className="text-xs text-blue-500">B2B</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button onClick={() => toggleStock(p)} className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2 py-1 rounded-lg">
                      {p.stock_level === 'out' ? 'Mark in stock' : 'Mark out'}
                    </button>
                    <button onClick={() => openEdit(p)} className="text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">Edit</button>
                    <button onClick={() => remove(p.id)} className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded-lg">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
