import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Plus, Pencil, Trash2, Loader2, Package, AlertCircle, X } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { getProducts, createProduct, updateProduct, deleteProduct, getMe } from '../lib/api'

const CATEGORIES = [
  { key: 'dermo_cosmetics',  label: 'Dermo-cosmetics' },
  { key: 'baby_care',        label: 'Baby care' },
  { key: 'supplements',      label: 'Supplements' },
  { key: 'orthopedics',      label: 'Orthopedics' },
  { key: 'wound_care',       label: 'Wound care' },
  { key: 'oral_hygiene',     label: 'Oral hygiene' },
  { key: 'hair_care',        label: 'Hair care' },
  { key: 'wellness_devices', label: 'Wellness' },
]

const STOCK_OPTIONS = [
  { key: 'high', label: 'High' }, { key: 'medium', label: 'Medium' },
  { key: 'low',  label: 'Low'  }, { key: 'out',    label: 'Out of stock' },
]

const STOCK_VARIANT = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }

const EMPTY_FORM = {
  name: '', brand: '', category: 'dermo_cosmetics',
  price_dzd: '', wholesale_price_dzd: '',
  stock_level: 'medium', is_b2b_listed: false, photo_url: '',
}

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
      } else { setLoading(false) }
    })
  }, [])

  function field(key, value) { setForm(f => ({ ...f, [key]: value })) }

  function openNew()  { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(p) {
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price_dzd: p.price_dzd, wholesale_price_dzd: p.wholesale_price_dzd || '',
      stock_level: p.stock_level, is_b2b_listed: p.is_b2b_listed, photo_url: p.photo_url,
    })
    setEditId(p.id); setShowForm(true)
  }

  async function save(e) {
    e.preventDefault(); setSaving(true)
    const payload = {
      ...form,
      price_dzd: parseInt(form.price_dzd),
      wholesale_price_dzd: form.wholesale_price_dzd ? parseInt(form.wholesale_price_dzd) : null,
    }
    const data = editId ? await updateProduct(editId, payload) : await createProduct(payload)
    if (data?.id) {
      setProducts(ps => editId ? ps.map(p => p.id === data.id ? data : p) : [data, ...ps])
      setShowForm(false)
    }
    setSaving(false)
  }

  async function remove(id) { await deleteProduct(id); setProducts(ps => ps.filter(p => p.id !== id)) }

  async function toggleStock(p) {
    const newLevel = p.stock_level === 'out' ? 'medium' : 'out'
    const updated = await updateProduct(p.id, { stock_level: newLevel })
    if (updated?.id) setProducts(ps => ps.map(x => x.id === updated.id ? updated : x))
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-2 text-slate-400 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist/dashboard" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-slate-200">|</span>
          <span className="font-semibold text-slate-800 text-sm">Catalogue</span>
        </div>
        <Button size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add product
        </Button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!pharmacyId && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Your account is not linked to a pharmacy yet. Please contact support.
          </div>
        )}

        {/* Add / Edit modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{editId ? 'Edit product' : 'Add product'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={save} className="p-5 space-y-4">
                <div>
                  <Label htmlFor="f-name">Product name *</Label>
                  <Input id="f-name" value={form.name} onChange={e => field('name', e.target.value)} required placeholder="e.g. Sensibio H2O" />
                </div>
                <div>
                  <Label htmlFor="f-brand">Brand</Label>
                  <Input id="f-brand" value={form.brand} onChange={e => field('brand', e.target.value)} placeholder="e.g. Bioderma" />
                </div>
                <div>
                  <Label htmlFor="f-cat">Category</Label>
                  <select id="f-cat" value={form.category} onChange={e => field('category', e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="f-price">Retail price (DZD) *</Label>
                    <Input id="f-price" type="number" value={form.price_dzd} onChange={e => field('price_dzd', e.target.value)} required min={0} />
                  </div>
                  <div>
                    <Label htmlFor="f-ws">Wholesale (DZD)</Label>
                    <Input id="f-ws" type="number" value={form.wholesale_price_dzd} onChange={e => field('wholesale_price_dzd', e.target.value)} min={0} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="f-stock">Stock level</Label>
                  <select id="f-stock" value={form.stock_level} onChange={e => field('stock_level', e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
                    {STOCK_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="f-photo">Photo URL</Label>
                  <Input id="f-photo" value={form.photo_url} onChange={e => field('photo_url', e.target.value)} placeholder="https://…" />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.is_b2b_listed} onChange={e => field('is_b2b_listed', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-slate-700">List on inter-pharmacy exchange</span>
                </label>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : editId ? 'Save changes' : 'Add product'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Your catalogue is empty.</p>
              <button onClick={openNew} className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
                Add your first product →
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.brand}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-700">{p.price_dzd.toLocaleString()} DZD</span>
                      <Badge variant={STOCK_VARIANT[p.stock_level]}>{p.stock_level === 'out' ? 'Out of stock' : p.stock_level}</Badge>
                      {p.is_b2b_listed && <Badge variant="blue">B2B</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => toggleStock(p)} className="text-xs px-2.5">
                      {p.stock_level === 'out' ? 'In stock' : 'Mark out'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 px-2.5">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(p.id)} className="text-red-500 border-red-200 hover:bg-red-50 px-2.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
