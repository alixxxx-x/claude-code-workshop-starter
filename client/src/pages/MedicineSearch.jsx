import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { searchMedicines, getMedicinePharmacies } from '../lib/api'

const CONFIDENCE_COLOR = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-orange-100 text-orange-700',
  unknown: 'bg-gray-100 text-gray-500',
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
    if (q) {
      setQuery(q)
      doSearch(q)
    }
  }, [])

  async function doSearch(q) {
    setLoading(true)
    setSelected(null)
    setPharmacies([])
    const data = await searchMedicines(q)
    setMedicines(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
      doSearch(query.trim())
    }
  }

  async function selectMedicine(med) {
    setSelected(med)
    setLoadingPharm(true)
    const data = await getMedicinePharmacies(med.id)
    setPharmacies(Array.isArray(data) ? data : [])
    setLoadingPharm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Find medicine</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Molecule or brand name (Metformin, Glucophage…)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm font-medium"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-gray-500 text-sm">Searching…</p>}

        {!loading && medicines.length === 0 && searchParams.get('q') && (
          <p className="text-gray-500 text-sm">No medicines found for "{searchParams.get('q')}"</p>
        )}

        {/* Medicine results */}
        {!selected && medicines.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-3">{medicines.length} result(s) — tap to see nearby pharmacies</p>
            {medicines.map(med => (
              <button
                key={med.id}
                onClick={() => selectMedicine(med)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">{med.commercial_name}</p>
                <p className="text-sm text-gray-500">{med.inn}{med.form ? ` · ${med.form}` : ''}{med.dosage ? ` · ${med.dosage}` : ''}</p>
                {med.brands?.length > 0 && (
                  <p className="text-xs text-emerald-600 mt-1">
                    {med.brands.length} equivalent brand(s)
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Pharmacy results for selected medicine */}
        {selected && (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-emerald-600 mb-4 hover:underline"
            >
              ← Back to results
            </button>
            <h2 className="font-semibold text-gray-800 mb-1">{selected.commercial_name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.inn}</p>

            {loadingPharm && <p className="text-gray-500 text-sm">Finding nearby pharmacies…</p>}

            {!loadingPharm && pharmacies.length === 0 && (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No availability reports yet for this medicine.</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to report after visiting a pharmacy.</p>
              </div>
            )}

            {pharmacies.map(({ pharmacy, confidence, status, reported_at }) => (
              <Link
                key={pharmacy.id}
                to={`/pharmacy/${pharmacy.id}`}
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition mb-2"
              >
                <div>
                  <p className="font-medium text-gray-800">{pharmacy.name}</p>
                  <p className="text-sm text-gray-500">{pharmacy.wilaya} · {pharmacy.address}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {status === 'found' ? '✅ Found' : '❌ Not found'} · {new Date(reported_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CONFIDENCE_COLOR[confidence] || CONFIDENCE_COLOR.unknown}`}>
                  {confidence}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
