'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from '@/lib/logout-button'

const DEMO_LEADS = [
  { id: '1', owner_name: 'John Smith', property_address: '123 Main St', city: 'Atlanta', state: 'GA', zip: '30301', motivation_score: 85, stage: 'New Lead', notes: '' },
  { id: '2', owner_name: 'Mary Johnson', property_address: '456 Oak Ave', city: 'Dallas', state: 'TX', zip: '75201', motivation_score: 72, stage: 'Contacted', notes: '' },
  { id: '3', owner_name: 'Robert Davis', property_address: '789 Pine Rd', city: 'Phoenix', state: 'AZ', zip: '85001', motivation_score: 91, stage: 'Interested', notes: '' },
  { id: '4', owner_name: 'Lisa Wilson', property_address: '321 Elm St', city: 'Miami', state: 'FL', zip: '33101', motivation_score: 68, stage: 'Offer Sent', notes: '' },
  { id: '5', owner_name: 'James Brown', property_address: '654 Maple Dr', city: 'Denver', state: 'CO', zip: '80201', motivation_score: 79, stage: 'New Lead', notes: '' },
]

const STAGES = ['New Lead', 'Contacted', 'Interested', 'Offer Sent', 'Under Contract', 'Closed', 'Dead']

interface Lead {
  id: string
  owner_name: string
  property_address: string
  city: string
  state: string
  zip: string
  motivation_score: number
  stage: string
  notes: string
}

interface Phone {
  number: string
  type: string
  dnc: boolean
  tcpa: boolean
  carrier: string
  rank: number
}

interface Person {
  full_name: string
  age: string
  litigator: boolean
  phones: Phone[]
  emails: string[]
  mailing_address: { street: string; city: string; state: string; zip: string }
}

interface SkipTraceResult {
  hit: boolean
  persons: Person[]
}

const stageColor = (status: string) => {
  switch (status) {
    case 'New Lead': return 'bg-gray-100 text-gray-700'
    case 'Contacted': return 'bg-blue-100 text-blue-700'
    case 'Interested': return 'bg-purple-100 text-purple-700'
    case 'Offer Sent': return 'bg-yellow-100 text-yellow-700'
    case 'Under Contract': return 'bg-orange-100 text-orange-700'
    case 'Closed': return 'bg-green-100 text-green-700'
    case 'Dead': return 'bg-red-100 text-red-500'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-500'
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [skipTracing, setSkipTracing] = useState<string | null>(null)
  const [skipResults, setSkipResults] = useState<Record<string, SkipTraceResult>>({})
  const [skipError, setSkipError] = useState<string | null>(null)

  const filtered = leads.filter((l) =>
    l.owner_name.toLowerCase().includes(search.toLowerCase()) ||
    l.property_address.toLowerCase().includes(search.toLowerCase())
  )

  const handleStageChange = (id: string, stage: string) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, stage } : l))
  }

  const handleNotesChange = (id: string, notes: string) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, notes } : l))
  }

  const handleSkipTrace = async (lead: Lead) => {
    setSkipTracing(lead.id)
    setSkipError(null)
    try {
      const response = await fetch('/api/skip-trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: lead.property_address,
          city: lead.city,
          state: lead.state,
          zip: lead.zip,
        }),
      })
      const data = await response.json()
      setSkipResults((prev) => ({ ...prev, [lead.id]: data }))
    } catch {
      setSkipError('Skip trace failed. Please try again.')
    }
    setSkipTracing(null)
  }

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
          <Link href="/dashboard" className="text-sm text-green-600 font-medium">Dashboard</Link>
          <Link href="/dashboard/kanban" className="text-sm text-gray-500 hover:text-gray-900">Kanban</Link>
          <Link href="/dashboard/offer-letter" className="text-sm text-gray-500 hover:text-gray-900">Offer Letter</Link>
          <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-900">Settings</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Lead Pipeline</h1>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
          />
        </div>

        {skipError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {skipError}
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{lead.owner_name}</h2>
                  <p className="text-sm text-gray-500">{lead.property_address}, {lead.city}, {lead.state} {lead.zip}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${scoreColor(lead.motivation_score)}`}>
                    Score: {lead.motivation_score}
                  </span>
                  <select
                    value={lead.stage}
                    onChange={(e) => handleStageChange(lead.id, e.target.value)}
                    className={`text-xs rounded-full px-3 py-1 font-medium border-0 ${stageColor(lead.stage)}`}
                  >
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleSkipTrace(lead)}
                  disabled={skipTracing === lead.id}
                  className="text-xs rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {skipTracing === lead.id ? 'Searching...' : '🔍 Skip Trace'}
                </button>
                <Link
                  href={`/dashboard/offer-letter?lead=${lead.id}`}
                  className="text-xs rounded-md bg-green-600 px-3 py-1.5 text-white hover:bg-green-700"
                >
                  📝 Offer Letter
                </Link>
                <Link
                  href={`/dashboard/researcher/${lead.id}`}
                  className="text-xs rounded-md bg-purple-600 px-3 py-1.5 text-white hover:bg-purple-700"
                >
                  🔬 Research
                </Link>
              </div>

              {skipResults[lead.id] && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {skipResults[lead.id].hit && skipResults[lead.id].persons?.length > 0 ? (
                    skipResults[lead.id].persons.map((person, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900">{person.full_name}</p>
                          {person.age && <span className="text-xs text-gray-500">Age: {person.age}</span>}
                          {person.litigator && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                              ⚠️ Litigator
                            </span>
                          )}
                        </div>
                        {person.phones?.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">📞 Phone Numbers:</p>
                            {person.phones.map((phone, j) => (
                              <div key={j} className="flex items-center gap-2 text-xs text-gray-700 mb-0.5">
                                <span className="font-medium">
                                  {phone.number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                                </span>
                                <span className="text-gray-400">{phone.type}</span>
                                {phone.dnc && <span className="text-red-500 font-medium">DNC</span>}
                                {phone.tcpa && <span className="text-orange-500 font-medium">TCPA</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        {person.emails?.length > 0 && (
                           <div className="mb-2">
                             <p className="text-xs font-medium text-gray-600 mb-1">📧 Emails:</p>
                             {person.emails.map((email: string | { email: string; rank: number }, j) => (
                               <p key={j} className="text-xs text-gray-700">
                                 {typeof email === 'string' ? email : email.email}
                               </p>
                             ))}
                            </div>
                        )}
                        {person.mailing_address?.street && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">📬 Mailing Address:</p>
                            <p className="text-xs text-gray-700">
                              {person.mailing_address.street}, {person.mailing_address.city}, {person.mailing_address.state} {person.mailing_address.zip}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No results found for this address.</p>
                  )}
                </div>
              )}

              <div className="mt-3">
                {editingNotes === lead.id ? (
                  <textarea
                    value={lead.notes}
                    onChange={(e) => handleNotesChange(lead.id, e.target.value)}
                    onBlur={() => setEditingNotes(null)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="Add call notes..."
                    autoFocus
                  />
                ) : (
                  <p
                    onClick={() => setEditingNotes(lead.id)}
                    className="text-sm text-gray-400 cursor-pointer hover:text-gray-600"
                  >
                    {lead.notes || 'Click to add call notes...'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}