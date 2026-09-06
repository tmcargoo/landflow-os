'use client'

import Link from 'next/link'
import LogoutButton from '@/lib/logout-button'

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: [
      {
        heading: 'Logging In',
        body: 'Go to landflow-os.vercel.app, enter your email and password provided by your administrator, and click Log In. You will land on your Lead Pipeline Dashboard.',
      },
      {
        heading: 'First-Time Setup',
        body: 'Before uploading leads, complete your company profile. Click Settings in the top navigation, enter your company name, address, phone, email, and your name as the investor, then click Save Settings. This information will automatically appear on every offer letter and contract you generate.',
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'The Dashboard',
    content: [
      {
        heading: 'What You See on Each Lead Card',
        body: 'Each lead card shows the owner name and property address, estimated equity, motivation score (color coded green/yellow/red), pipeline stage dropdown, action buttons (Skip Trace, Offer Letter, Research), and a call notes field.',
      },
      {
        heading: 'Motivation Score Colors',
        body: '🟢 Green (80+) = High motivation | 🟡 Yellow (60–79) = Medium motivation | 🔴 Red (below 60) = Low motivation',
      },
      {
        heading: 'Pipeline Stages',
        body: 'Move leads through: New Lead → Contacted → Interested → Offer Sent → Under Contract → Closed → Dead. Update the stage dropdown on each card as you work the lead.',
      },
    ],
  },
  {
    id: 'uploading',
    title: 'Uploading Leads',
    content: [
      {
        heading: 'How to Upload a CSV',
        body: 'From the dashboard, find the Upload Leads CSV area at the top. Click Choose File, select your CSV file, and wait for the confirmation message showing how many leads were imported.',
      },
      {
        heading: 'Required CSV Columns',
        body: 'Your CSV must include: Address, City, State, Zip, APN, Owner 1 First Name, Owner 1 Last Name, Mailing Address, Mailing City, Mailing State, Mailing Zip, Est. Equity, Foreclosure Factor, Notes.',
      },
      {
        heading: 'No CSV Yet?',
        body: 'Click the Download Template link next to the upload area to get a pre-formatted CSV template. Fill it in with your lead data and upload it.',
      },
    ],
  },
  {
    id: 'skip-tracing',
    title: 'Skip Tracing',
    content: [
      {
        heading: 'How to Skip Trace a Lead',
        body: 'Find the lead on your dashboard and click the 🔍 Skip Trace button. Results appear within a few seconds showing owner name, age, phone numbers, email addresses, and mailing address.',
      },
      {
        heading: 'Understanding the Flags',
        body: 'DNC = Do Not Call (on the national registry). TCPA = Telephone Consumer Protection Act flag. ⚠️ Litigator = this person has a history of filing lawsuits. Always check these flags before calling.',
      },
    ],
  },
  {
    id: 'offer-letter',
    title: 'Offer Letter Generator',
    content: [
      {
        heading: 'How to Generate an Offer Letter',
        body: 'Click Offer Letter in the top navigation or the 📝 Offer Letter button on any lead card. Select the lead, choose how the seller made first contact, enter your offer price and any back taxes, select an expiration date, then click Generate Offer Letter & Contract.',
      },
      {
        heading: 'Printing and Downloading',
        body: 'After generating, click 🖨️ Print / Download PDF to save or print both the offer letter and purchase agreement. Your browser\'s print dialog will open — choose Save as PDF to create a file.',
      },
      {
        heading: 'Important Note',
        body: 'Your company information is pulled automatically from your Settings. Always review the letter before sending.',
      },
    ],
  },
  {
    id: 'scoring',
    title: 'Motivation Score Editor',
    content: [
      {
        heading: 'How to Customize Scoring',
        body: 'Click Scoring in the top navigation. Use the sliders to adjust the weight of each factor: High Equity, Out of State Owner, Foreclosure Factor, Tax Delinquent, and Vacant Property.',
      },
      {
        heading: 'Applying Your Changes',
        body: 'Click Save Weights first, then click Recalculate All Scores to update all your leads with the new scoring weights.',
      },
    ],
  },
  {
    id: 'kanban',
    title: 'Kanban Board',
    content: [
      {
        heading: 'How to Use the Kanban Board',
        body: 'Click Kanban in the top navigation. Each column represents a pipeline stage. Drag and drop cards between columns to update a lead\'s stage. Each card shows the owner name, address, motivation score, and current stage.',
      },
    ],
  },
  {
    id: 'mail-merge',
    title: 'Mail Merge Export',
    content: [
      {
        heading: 'How to Export for Mail Campaigns',
        body: 'Click Mail Merge in the top navigation. Select which pipeline stages to include by clicking the stage buttons. Then check individual leads or click Select All. Click Export Selected Leads to download a CSV file ready to upload to any mail house of your choice.',
      },
      {
        heading: 'Campaign Logging',
        body: 'Every export is automatically logged against each lead. Look for "Last mailed: [date]" on the lead card so you always know when a lead was last included in a campaign.',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Tips for Best Results',
    content: [
      {
        heading: 'Best Practices',
        body: '• Upload leads regularly to keep your pipeline active\n• Update pipeline stages as you work leads\n• Add call notes after every contact attempt\n• Skip trace before calling — always check DNC flags first\n• Customize your scoring weights to match your market',
      },
    ],
  },
]

export default function HelpPage() {
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
          <Link href="/dashboard/help" className="text-sm text-green-600 font-medium">Help</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & User Guide</h1>
            <p className="text-sm text-gray-500 mt-1">Everything you need to get the most out of LandFlow OS</p>
          </div>
          <a
            href="/api/subscriber-guide"
            download
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            ⬇️ Download Guide
          </a>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-48 shrink-0">
            <div className="sticky top-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contents</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  
                  <a  key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-600 hover:text-green-600 py-0.5"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 space-y-10">
            {sections.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((item, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.heading}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}