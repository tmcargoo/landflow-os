'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import LogoutButton from '@/lib/logout-button'

const DEFAULT_WEIGHTS = {
  equity_weight: 25,
  out_of_state_weight: 20,
  foreclosure_weight: 25,
  tax_delinquent_weight: 20,
  vacant_weight: 10,
}

const FACTORS = [
  {
    key: 'equity_weight',
    label: 'High Equity',
    description: 'Properties with significant equity (over $50k)',
    color: 'bg-green-500',
  },
  {
    key: 'out_of_state_weight',
    label: 'Out of State Owner',
    description: 'Owner mailing address is in a different state',
    color: 'bg-blue-500',
  },
  {
    key: 'foreclosure_weight',
    label: 'Foreclosure Factor',
    description: 'Property has foreclosure indicators',
    color: 'bg-red-500',
  },
  {
    key: 'tax_delinquent_weight',
    label: 'Tax Delinquent',
    description: 'Owner has outstanding tax delinquency',
    color: 'bg-orange-500',
  },
  {
    key: 'vacant_weight',
    label: 'Vacant Property',
    description: 'Property appears to be vacant',
    color: 'bg-purple-500',
  },
]

export default function ScoringPage() {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [recalculated, setRecalculated] = useState(false)

  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  useEffect(() => {
    const loadWeights = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('scoring_weights')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setWeights({
          equity_weight: data.equity_weight,
          out_of_state_weight: data.out_of_state_weight,
          foreclosure_weight: data.foreclosure_weight,
          tax_delinquent_weight: data.tax_delinquent_weight,
          vacant_weight: data.vacant_weight,
        })
      }
      setLoading(false)
    }
    loadWeights()
  }, [])

  const handleChange = (key: string, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
    setRecalculated(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('scoring_weights')
      .upsert({ ...weights, user_id: user.id }, { onConflict: 'user_id' })

    setSaving(false)
    setSaved(true)
  }

  const handleRecalculate = async () => {
    setRecalculating(true)
    setRecalculated(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: leads } = await supabase
      .from('leads')
      .select('id, estimated_equity, out_of_state, tax_delinquent, vacant')
      .eq('user_id', user.id)

    if (!leads || leads.length === 0) {
      setRecalculating(false)
      setRecalculated(true)
      return
    }

    const updates = leads.map((lead) => {
      let score = 50
      if ((lead.estimated_equity || 0) > 50000) score += weights.equity_weight
      if (lead.out_of_state) score += weights.out_of_state_weight
      if (lead.tax_delinquent) score += weights.tax_delinquent_weight
      if (lead.vacant) score += weights.vacant_weight
      if (score > 99) score = 99
      return { id: lead.id, motivation_score: score }
    })

    for (const update of updates) {
      await supabase
        .from('leads')
        .update({ motivation_score: update.motivation_score })
        .eq('id', update.id)
    }

    setRecalculating(false)
    setRecalculated(true)
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
          <Link href="/dashboard/offer-letter" className="text-sm text-gray-500 hover:text-gray-900">Offer Letter</Link>
          <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-900">Settings</Link>
          <Link href="/dashboard/scoring" className="text-sm text-green-600 font-medium">Scoring</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Motivation Score Weights</h1>
        <p className="text-sm text-gray-500 mb-8">
          Adjust how much each factor contributes to a lead's motivation score.
          Higher weight = more impact on the score. Save your weights, then recalculate all leads.
        </p>

        {total !== 100 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Weights currently add up to {total}. They don't need to equal 100, but keep that in mind when scoring.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 mb-6">
          {FACTORS.map(({ key, label, description, color }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 w-8 text-right">
                    {weights[key as keyof typeof weights]}
                  </span>
                  <span className="text-xs text-gray-400">pts</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[key as keyof typeof weights]}
                  onChange={(e) => handleChange(key, parseInt(e.target.value))}
                  className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer`}
                />
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                <div
                  className={`h-1.5 rounded-full ${color}`}
                  style={{ width: `${(weights[key as keyof typeof weights] / 50) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Weights'}
          </button>
          <button
            onClick={handleRecalculate}
            disabled={recalculating || !saved}
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {recalculating ? 'Recalculating...' : recalculated ? '✓ Scores Updated!' : 'Recalculate All Scores'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Save your weights first, then recalculate to update all lead scores.
        </p>
      </div>
    </div>
  )
}