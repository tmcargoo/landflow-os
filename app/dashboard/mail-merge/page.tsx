'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import LogoutButton from '@/lib/logout-button'

const EXPORTABLE_STAGES = ['New Lead', 'Contacted', 'Interested', 'Offer Sent', 'Under Contract']

interface Lead {
  id: string
  owner_name: string
  property_address: string
  city: string
  state: string
  zip: string
  owner_address: string
  pipeline_status: string
  motivation_score: number
  last_mailed?: string
}

export default function MailMergePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStages, setSelectedStages] = useState<string[]>(['New Lead'])
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [exporting, setExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: leadsData } = await supabase
      .from('leads')
      .select('*')
      .in('pipeline_status', EXPORTABLE_STAGES)
      .order('motivation_score', { ascending: false })

    const { data: logsData } = await supabase
      .from('campaign_logs')
      .select('lead_id, exported_at')
      .eq('user_id', user.id)
      .order('exported_at', { ascending: false })

    const lastMailed: Record<string, string> = {}
    logsData?.forEach((log) => {
      if (!lastMailed[log.lead_id]) {
        lastMailed[log.lead_id] = new Date(log.exported_at).toLocaleDateString()
      }
    })

    const enriched = (leadsData || []).map((lead) => ({
      ...lead,
      last_mailed: lastMailed[lead.id] || null,
    }))

    setLeads(enriched)
    setLoading(false)
  }

  const filteredLeads = leads.filter((l) => selectedStages.includes(l.pipeline_status))

  const toggleStage = (stage: string) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    )
    setSelectedLeads(new Set())
  }

  const toggleLead = (id: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedLeads(new Set(filteredLeads.map((l) => l.id)))
  }

  const deselectAll = () => {
    setSelectedLeads(new Set())
  }

  const handleExport = async () => {
    if (selectedLeads.size === 0) {
      setExportStatus('Please select at least one lead to export.')
      return
    }

    setExporting(true)
    setExportStatus('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const toExport = leads.filter((l) => selectedLeads.has(l.id))

    // Build CSV
    const headers = [
      'Recipient Name',
      'Mailing Address',
      'Mailing City',
      'Mailing State',
      'Mailing Zip',
      'Property Address',
      'Property City',
      'Property State',
      'Property Zip',
      'Pipeline Stage',
      'Motivation Score',
    ].join(',')

    const rows = toExport.map((lead) => {
      const mailingParts = (lead.owner_address || '').split(',').map((p) => p.trim())
      const mailingStreet = mailingParts[0] || lead.property_address
      const mailingCity = mailingParts[1] || lead.city
      const mailingStatePart = mailingParts[2] || ''
      const mailingStateVal = mailingStatePart.split(' ')[0] || lead.state
      const mailingZip = mailingStatePart.split(' ')[1] || lead.zip

      return [
        `"${lead.owner_name}"`,
        `"${mailingStreet}"`,
        `"${mailingCity}"`,
        `"${mailingStateVal}"`,
        `"${mailingZip}"`,
        `"${lead.property_address}"`,
        `"${lead.city}"`,
        `"${lead.state}"`,
        `"${lead.zip}"`,
        `"${lead.pipeline_status}"`,
        lead.motivation_score,
      ].join(',')
    })

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `landflow-mailmerge-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    // Log the export
    const logs = toExport.map((lead) => ({
      user_id: user.id,
      lead_id: lead.id,
      campaign_type: 'Mail Merge',
    }))

    await supabase.from('campaign_logs').insert(logs)

    setExportStatus(`✓ ${toExport.length} leads exported and logged successfully!`)
    setExporting(false)
    await loadLeads()
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
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
          <Link href="/dashboard/kanban" className="text-sm text-gray-500 hover:text-gray-900">Kanban</Link>
          <Link href="/dashboard/offer-letter" className="text-sm text-gray-500 hover:text-gray-900">Offer Letter</Link>
          <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-900">Settings</Link>
          <Link href="/dashboard/scoring" className="text-sm text-gray-500 hover:text-gray-900">Scoring</Link>
          <Link href="/dashboard/mail-merge" className="text-sm text-green-600 font-medium">Mail Merge</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Mail Merge Export</h1>
        <p className="text-sm text-gray-500 mb-6">
          Select leads by pipeline stage, fine-tune your selection, then export a universal CSV
          ready to upload to any mail house of your choice.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Filter by Pipeline Stage</p>
          <div className="flex flex-wrap gap-2">
            {EXPORTABLE_STAGES.map((stage) => (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  selectedStages.includes(stage)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No leads found for the selected stages.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                {filteredLeads.length} leads shown · {selectedLeads.size} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => toggleLead(lead.id)}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedLeads.has(lead.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{lead.owner_name}</p>
                        <p className="text-xs text-gray-500">{lead.property_address}, {lead.city}, {lead.state}</p>
                        {lead.last_mailed && (
                          <p className="text-xs text-orange-500 mt-0.5">Last mailed: {lead.last_mailed}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500">{lead.pipeline_status}</p>
                      <p className="text-xs text-gray-400">Score: {lead.motivation_score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {exportStatus && (
              <p className={`text-sm mb-3 ${exportStatus.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                {exportStatus}
              </p>
            )}

            <button
              onClick={handleExport}
              disabled={exporting || selectedLeads.size === 0}
              className="w-full rounded-md bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : `Export ${selectedLeads.size} Selected Leads`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}