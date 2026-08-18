'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import LogoutButton from '@/lib/logout-button'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    investor_name: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setForm({
          company_name: data.company_name || '',
          company_address: data.company_address || '',
          company_phone: data.company_phone || '',
          company_email: data.company_email || '',
          investor_name: data.investor_name || '',
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('company_profiles')
      .upsert({ ...form, user_id: user.id }, { onConflict: 'user_id' })

    setSaving(false)
    if (!error) setSaved(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LF</span>
          </div>
          <span className="font-semibold text-gray-900">LandFlow OS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
          <Link href="/dashboard/kanban" className="text-sm text-gray-500 hover:text-gray-900">Kanban</Link>
          <Link href="/dashboard/settings" className="text-sm text-green-600 font-medium">Settings</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Company Settings</h1>
        <p className="text-sm text-gray-500 mb-8">This information will appear on every offer letter and contract you generate.</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {[
            { label: 'Company Name', name: 'company_name', placeholder: 'PANAD Investments LLC' },
            { label: 'Company Address', name: 'company_address', placeholder: '123 Main St, City, State 12345' },
            { label: 'Company Phone', name: 'company_phone', placeholder: '(555) 555-5555' },
            { label: 'Company Email', name: 'company_email', placeholder: 'info@yourcompany.com' },
            { label: 'Your Name (Investor)', name: 'investor_name', placeholder: 'Terry McArgoo' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}