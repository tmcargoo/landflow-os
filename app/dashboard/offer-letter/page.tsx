'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import LogoutButton from '@/lib/logout-button'

const CONTACT_METHODS = ['Direct Mail', 'Phone Call', 'Advertisement', 'Online Ad', 'Referral']

const DEMO_LEADS = [
  { id: '1', owner_name: 'John Smith', property_address: '123 Main St', city: 'Atlanta', state: 'GA', acreage: '2.5', apn: '123-456-789' },
  { id: '2', owner_name: 'Mary Johnson', property_address: '456 Oak Ave', city: 'Dallas', state: 'TX', acreage: '5.0', apn: '987-654-321' },
  { id: '3', owner_name: 'Robert Davis', property_address: '789 Pine Rd', city: 'Phoenix', state: 'AZ', acreage: '1.75', apn: '456-123-789' },
]

interface Profile {
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  investor_name: string
}

export default function OfferLetterPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [selectedLead, setSelectedLead] = useState(DEMO_LEADS[0])
  const [contactMethod, setContactMethod] = useState('Direct Mail')
  const [offerPrice, setOfferPrice] = useState('')
  const [backTaxes, setBackTaxes] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [letterContent, setLetterContent] = useState('')
  const [contractContent, setContractContent] = useState('')
  const [error, setError] = useState('')

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
      if (data) setProfile(data)
    }
    loadProfile()
  }, [])

  const handleGenerate = async () => {
    if (!offerPrice) { setError('Please enter an offer price.'); return }
    if (!expirationDate) { setError('Please enter an expiration date.'); return }
    if (!profile) { setError('Please fill in your Company Settings first.'); return }
    setError('')
    setGenerating(true)
    setLetterContent('')
    setContractContent('')

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const buyerEstimate = offerPrice ? `$${(parseFloat(offerPrice.replace(/[^0-9.]/g, '')) + parseFloat(backTaxes.replace(/[^0-9.]/g, '') || '0')).toLocaleString()}` : ''

    const prompt = `You are generating a real estate offer letter and purchase agreement for a land investor. Use ONLY the information provided — do not add, invent, or assume any details.

COMPANY INFO:
- Company Name: ${profile.company_name}
- Company Address: ${profile.company_address}
- Company Phone: ${profile.company_phone}
- Company Email: ${profile.company_email}
- Investor Name: ${profile.investor_name}

SELLER INFO:
- Seller Name: ${selectedLead.owner_name}
- Property Address: ${selectedLead.property_address}, ${selectedLead.city}, ${selectedLead.state}
- Acreage: ${selectedLead.acreage} acres
- APN/Parcel ID: ${selectedLead.apn}

DEAL INFO:
- Contact Method: ${contactMethod}
- Offer Price (Net to Seller): $${offerPrice}
- Approx Outstanding Back Taxes: ${backTaxes ? '$' + backTaxes : 'N/A'}
- Buyer Estimated Total Cost: ${buyerEstimate}
- Today's Date: ${today}
- Agreement Expiration Date: ${expirationDate}

Generate exactly two documents separated by "---CONTRACT---":

DOCUMENT 1: A professional offer letter following this structure:
- Header with company name, address, phone, email
- Seller name and address
- Date
- Opening: "Dear [Seller Name],"
- Thank them for responding via ${contactMethod} (adjust the wording naturally for this contact method)
- State the offer details clearly
- Professional closing paragraph about covering all costs
- Instructions for returning the agreement (3 options: text, email, mail)
- Signature block with investor name, company, phone, email

DOCUMENT 2: A Purchase and Sale Agreement with all 12 standard clauses filled in with the provided details.

Use plain text formatting only. No markdown. No asterisks. No bullet symbols.`

    try {
      const response = await fetch('/api/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
       })

      const data = await response.json()
      const fullText = data.content?.[0]?.text || ''
      const parts = fullText.split('---CONTRACT---')
      setLetterContent(parts[0]?.trim() || '')
      setContractContent(parts[1]?.trim() || '')
    } catch {
      setError('Something went wrong generating the letter. Please try again.')
    }

    setGenerating(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LF</span>
          </div>
          <span className="font-semibold text-gray-900">LandFlow OS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
          <Link href="/dashboard/kanban" className="text-sm text-gray-500 hover:text-gray-900">Kanban</Link>
          <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-900">Settings</Link>
          <Link href="/dashboard/offer-letter" className="text-sm text-green-600 font-medium">Offer Letter</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 print:hidden">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Offer Letter Generator</h1>

        {!profile && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Please fill in your <Link href="/dashboard/settings" className="underline font-medium">Company Settings</Link> before generating letters.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Lead / Property</label>
            <select
              value={selectedLead.id}
              onChange={(e) => setSelectedLead(DEMO_LEADS.find(l => l.id === e.target.value) || DEMO_LEADS[0])}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              {DEMO_LEADS.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.owner_name} — {lead.property_address}, {lead.city}, {lead.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How did the seller make contact?</label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (Net to Seller)</label>
              <input
                type="text"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="15000"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approx Back Taxes (optional)</label>
              <input
                type="text"
                value={backTaxes}
                onChange={(e) => setBackTaxes(e.target.value)}
                placeholder="500"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Offer Letter & Contract'}
          </button>
        </div>
      </div>

      {(letterContent || contractContent) && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <div className="flex justify-between items-center mb-4 print:hidden">
            <h2 className="text-lg font-bold text-gray-900">Generated Documents</h2>
            <button
              onClick={handlePrint}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              🖨️ Print / Download PDF
            </button>
          </div>

          {letterContent && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
              {letterContent}
            </div>
          )}

          {contractContent && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
              {contractContent}
            </div>
          )}
        </div>
      )}
    </div>
  )
}