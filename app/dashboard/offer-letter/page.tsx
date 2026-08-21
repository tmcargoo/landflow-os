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

const contactPhrase: Record<string, string> = {
      'Direct Mail': 'responding to our direct mail',
      'Phone Call': 'calling us',
      'Advertisement': 'responding to our advertisement',
      'Online Ad': 'reaching out through our online ad',
      'Referral': 'reaching out based on a referral',
    }

    const phrase = contactPhrase[contactMethod] || 'responding to our direct mail'
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const formatMoney = (val: string) => {
      const num = parseFloat(val.replace(/[^0-9.]/g, ''))
      if (isNaN(num)) return '0'
      return num.toLocaleString('en-US')
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${month}-${day}-${year}`
    }

    const netToSeller = formatMoney(offerPrice)
    const backTaxesFormatted = backTaxes ? formatMoney(backTaxes) : 'N/A'
    const totalCost = formatMoney(
      String(parseFloat(offerPrice.replace(/[^0-9.]/g, '')) + parseFloat(backTaxes.replace(/[^0-9.]/g, '') || '0'))
    )

    const prompt = `Fill in ONLY the blank fields. Do NOT rewrite or rephrase anything else. Output the completed documents exactly as shown below.

${profile.company_name} | ${profile.company_address}
${profile.company_phone} | ${profile.company_email}

${selectedLead.owner_name}                                                    Date: ${today}
${selectedLead.property_address}
${selectedLead.city}, ${selectedLead.state}

Dear ${selectedLead.owner_name},

Thank you for ${phrase} about purchasing your ${selectedLead.acreage} acre property at:

${selectedLead.property_address}, ${selectedLead.city}, ${selectedLead.state}

After doing some research, we are willing to offer you the following for your property:

Net Paid To Seller: $${netToSeller}
Approx Outstanding Back Taxes: ${backTaxes ? '$' + backTaxesFormatted : 'N/A'}
Buyer Estimated Cost To Purchase: $${totalCost}

We are a real estate investment company and pride ourselves on professional and trouble-free transactions with seller satisfaction in mind. We will pay all of the associated costs of completing this transaction, including back taxes within reason, as well as title and escrow fees.

The price we agree upon is the amount of the cashier's check you will receive. If you are interested in selling, simply sign the attached Purchase Agreement and follow the instructions at the bottom of this letter.

Feel free to contact me anytime at ${profile.company_phone} to discuss this property or the sale of any other properties you may own. If you are not interested in selling at this time, please keep this letter and feel free to contact us if you decide to sell at a later date.

Kind Regards,

${profile.investor_name}
${profile.company_name}
${profile.company_phone}
${profile.company_email}

INSTRUCTIONS FOR RETURNING AGREEMENT

Option 1: Sign and take a picture of the contract with your phone, and text it to ${profile.company_phone}.
Option 2: Email the picture to ${profile.company_email}.
Option 3: Mail to ${profile.company_name} & ${profile.company_address}

---CONTRACT---

${profile.company_name} | ${profile.company_address}
${profile.company_phone} | ${profile.company_email}

PURCHASE AND SALE AGREEMENT

This contract dated ${today} in which Buyer: ${profile.investor_name}, offers to purchase from Seller: ${selectedLead.owner_name} the following described real estate, together with all improvements thereon and all appurtenant rights, located at:

ADDRESS / APPROX ACREAGE: ${selectedLead.property_address}, ${selectedLead.city}, ${selectedLead.state} / ${selectedLead.acreage} acres
APN / PARCEL ID: ${selectedLead.apn}

1) The purchase price is to be $${netToSeller} payable in cash at closing.
2) The conditions of this Purchase are as follows:
   a) Property is sold in "AS-IS" condition with no warranties made by the seller. Seller will make Buyer aware of any known facts that affect the value of the Property.
   b) If Seller cannot provide clear title, or clear access, or doesn't allow proper inspection of the property, Buyer will be released from any further obligation under this contract; otherwise Seller promises to sell under this contract.
   c) Buyer shall select closing agent and where the Closing will be held.
   d) This Purchase Agreement is assignable.
   e) Buyer's performance in buying this property is contingent upon the Buyer's satisfactory due diligence of the property.
3) Taxes to be prorated, any previous year's taxes to be paid by Seller. All attorney closing fees and customary closing costs shall be paid by the Buyer.
4) Closing will be within Ninety (90) Days of agreement being accepted and signed by both Buyer and Seller. Seller grants any extension needed to clear title or to complete closing documentation. Title to the above described real estate to be conveyed by General Warranty Deed or other customary instrument of transfer.
5) Closing may be extended an additional Thirty (30) days at Buyer request if still performing due diligence under the terms of this agreement.
6) Title is to be free, clear, and unencumbered, free of any county, city and federal liens. All liens against the property shall be paid at closing by the seller.
7) This offer, when accepted, comprises the entire agreement of Purchaser and Seller, and it is agreed that no other representations have been made.
8) This offer will become a binding agreement when accepted and signed by both Buyer and Seller. If it is not accepted and signed by the Seller prior to ${formatDate(expirationDate)}, this agreement will be void.
9) Buyer is agreeing to purchase property to lease or resell for a profit. Buyer and Seller agree that the Buyer is not intending to occupy the property. Seller understands that Buyer and/or its assigns or representatives are not earning any fee or commission from Seller. Seller should not expect representation from Buyer and/or its assigns or representatives.
10) Seller agrees that Buyer can market the property, including on the MLS, for buyers prior to closing.
11) Buyer retains the right to terminate this agreement by delivering to the Seller, a written notice of cancellation.
12) Additional Terms (if applicable):

SELLER:                                          BUYER:
Signature: ___________________________           Signature: ___________________________
Printed Name & Date: _________________           Printed Name & Date: _________________

Output only the two documents. No explanations. No markdown. No asterisks.`
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