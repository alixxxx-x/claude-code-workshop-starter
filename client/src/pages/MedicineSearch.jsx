import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ChevronLeft, Loader2, Pill, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { searchMedicines, getMedicinePharmacies } from '../lib/api'

const CONFIDENCE_VARIANT = {
  high:    'default',
  medium:  'warning',
  low:     'orange',
  unknown: 'secondary',
}

export default function MedicineSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [medicines, setMedicines] = useState([])
  const [selected, setSelected] = useState(null)
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPharm, setLoadingPharm] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q) }
  }, [])

  async function doSearch(q) {
    setLoading(true); setSelected(null); setPharmacies([])
    const data = await searchMedicines(q)
    setMedicines(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) { setSearchParams({ q: query.trim() }); doSearch(query.trim()) }
  }

  async function selectMedicine(med) {
    setSelected(med); setLoadingPharm(true)
    const data = await getMedicinePharmacies(med.id)
    setPharmacies(Array.isArray(data) ? data : [])
    setLoadingPharm(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Find medicine</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Molecule or brand (Metformin, Glucophage…)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm font-semibold shrink-0"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Searching…
          </div>
        )}

        {!loading && medicines.length === 0 && searchParams.get('q') && (
          <Card>
            <CardContent className="py-10 text-center">
              <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No medicines found for "{searchParams.get('q')}"</p>
              <p className="text-xs text-slate-400 mt-1">Try the molecule name (e.g. Metformine) or a brand (e.g. Glucophage)</p>
            </CardContent>
          </Card>
        )}

        {/* Medicine list */}
        {!selected && medicines.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 mb-3 px-1">{medicines.length} result(s) — tap to see nearby pharmacies</p>
            {medicines.map(med => (
              <button
                key={med.id}
                onClick={() => selectMedicine(med)}
                className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{med.commercial_name}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {med.inn}{med.form ? ` · ${med.form}` : ''}{med.dosage ? ` · ${med.dosage}` : ''}
                    </p>
                  </div>
                  {med.brands?.length > 0 && (
                    <Badge variant="secondary" className="shrink-0 mt-0.5">
                      {med.brands.length} brand{med.brands.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pharmacy results */}
        {selected && (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-4"
            >
              <ChevronLeft className="w-4 h-4" /> Back to results
            </button>

            <div className="mb-4">
              <p className="font-semibold text-slate-800">{selected.commercial_name}</p>
              <p className="text-sm text-slate-500">{selected.inn}{selected.dosage ? ` · ${selected.dosage}` : ''}</p>
            </div>

            {loadingPharm && (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Finding nearby pharmacies…
              </div>
            )}

            {!loadingPharm && pharmacies.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-slate-500 text-sm">No availability reports yet for this medicine.</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to report after visiting a pharmacy.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {pharmacies.map(({ pharmacy, confidence, status, reported_at }) => (
                <Link
                  key={pharmacy.id}
                  to={`/pharmacy/${pharmacy.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{pharmacy.name}</p>
                    <p className="text-xs text-slate-500 truncate">{pharmacy.wilaya} · {pharmacy.address}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {status === 'found'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400" />
                      }
                      <span className="text-xs text-slate-400">
                        {status === 'found' ? 'Found' : 'Not found'} · {new Date(reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={CONFIDENCE_VARIANT[confidence] || 'secondary'} className="shrink-0">
                    {confidence}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
