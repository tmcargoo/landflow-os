 
"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from '@/lib/logout-button'

const CHECKLIST = [
  { key: "county_records", label: "County assessor records verified" },
  { key: "tax_status", label: "Tax status confirmed" },
  { key: "flood_zone", label: "Flood zone check complete (FEMA)" },
  { key: "zoning", label: "Zoning confirmed for intended use" },
  { key: "liens", label: "Lien search completed" },
  { key: "hoa", label: "HOA status confirmed" },
  { key: "access_road", label: "Legal access / road access verified" },
  { key: "utilities", label: "Utility availability checked" },
  { key: "comparable_sales", label: "3+ comparable sales reviewed" },
  { key: "owner_contact", label: "Owner contact info located" },
];

const DEMO_LEAD = {
  id: "1",
  owner_name: "John Smith",
  property_address: "123 Main St",
  city: "Austin",
  state: "TX",
  zip: "78701",
  ownership_years: 25,
  estimated_equity: 75,
  out_of_state: true,
  tax_delinquent: true,
  vacant: false,
  motivation_score: 72,
};

type CheckState = Record<string, boolean | null>;

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-400" : "bg-gray-300";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

const LINKS = [
  { label: "Google Maps", url: "https://maps.google.com" },
  { label: "Zillow", url: "https://www.zillow.com" },
  { label: "FEMA Flood Map", url: "https://msc.fema.gov/portal/home" },
  { label: "County Records", url: "https://www.countyoffice.org" },
  { label: "Find Owner Phone", url: "https://www.truepeoplesearch.com" },
];export default function SaturdayResearcher() {
  const lead = DEMO_LEAD;
  const [checks, setChecks] = useState<CheckState>(
    Object.fromEntries(CHECKLIST.map((c) => [c.key, null]))
  );

  const toggle = (key: string, value: boolean) => {
    setChecks((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const passed = Object.values(checks).filter((v) => v === true).length;
  const failed = Object.values(checks).filter((v) => v === false).length;
  const pending = CHECKLIST.length - passed - failed;
  const pct = Math.round((passed / CHECKLIST.length) * 100);

  const scoreColor =
    lead.motivation_score >= 70
      ? "text-green-600"
      : lead.motivation_score >= 40
      ? "text-yellow-600"
      : "text-gray-400";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LF</span>
          </div>
          <span className="font-semibold text-gray-900">LandFlow OS</span>
          <span className="text-gray-300 mx-2">/</span>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
            Dashboard
          </Link>
          <span className="text-gray-300 mx-2">/</span>
          <span className="text-sm text-gray-900">Saturday Researcher</span>
          <span className="text-gray-300 mx-2">/</span>
          <span className="text-sm text-gray-900">Saturday Researcher</span>
          <LogoutButton />
       </div>
      </nav>
           
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{lead.owner_name}</h1>
            <p className="text-sm text-gray-400">
              {lead.property_address}, {lead.city}, {lead.state} {lead.zip}
            </p>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            Back to leads
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Lead details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Motivation score</p>
                  <p className={`text-lg font-semibold ${scoreColor}`}>
                    {lead.motivation_score}
                    <span className="text-xs text-gray-400 font-normal">/100</span>
                  </p>
                  <ScoreBar score={lead.motivation_score} />
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Ownership years</p>
                  <p className="text-sm font-medium text-gray-800">{lead.ownership_years} yrs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Estimated equity</p>
                  <p className="text-sm font-medium text-gray-800">{lead.estimated_equity}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Out of state</p>
                  <p className="text-sm font-medium text-gray-800">{lead.out_of_state ? "Yes" : "No"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Tax delinquent</p>
                  <p className="text-sm font-medium text-gray-800">{lead.tax_delinquent ? "Yes" : "No"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Vacant</p>
                  <p className="text-sm font-medium text-gray-800">{lead.vacant ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick research links</h2>
              <div className="space-y-2">
                {LINKS.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 group transition-colors">
                    <span className="text-sm text-gray-700 group-hover:text-green-700">{item.label}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Open →</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">Due diligence checklist</h2>
              <div className="flex gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{passed} pass</span>
                <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">{failed} fail</span>
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{pending} pending</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              {CHECKLIST.map(({ key, label }) => {
                const state = checks[key];
                return (
                  <div key={key} className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${state === true ? "border-green-200 bg-green-50" : state === false ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"}`}>
                    <span className={`text-sm flex-1 ${state === false ? "line-through text-gray-300" : "text-gray-700"}`}>
                      {label}
                    </span>
                    <div className="flex gap-2 ml-3">
                      <button onClick={() => toggle(key, true)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${state === true ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"}`}>
                        Pass
                      </button>
                      <button onClick={() => toggle(key, false)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${state === false ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"}`}>
                        Fail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}