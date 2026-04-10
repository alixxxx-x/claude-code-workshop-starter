import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, Lock, Loader2, AlertCircle, Stethoscope } from 'lucide-react'
import { login } from '../lib/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'

export default function PharmacistLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const data = await login(form.phone, form.password)
    setLoading(false)
    if (data?.access) {
      navigate('/pharmacist/dashboard')
    } else {
      setError(data?.detail || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 mb-4">
            <Stethoscope className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>دَوَاء</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Pharmacist portal</p>
        </div>

        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-slate-300">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+213 555 000 002"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    className="pl-10 bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    className="pl-10 bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 rounded-xl px-3 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign in'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-600 text-center text-sm text-slate-400">
              <p>
                Patient?{' '}
                <Link to="/login" className="text-emerald-400 font-medium hover:underline">
                  Patient login
                </Link>
              </p>
              <p className="mt-3 text-xs text-slate-500">Demo: +213555000002 / demo1234</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
