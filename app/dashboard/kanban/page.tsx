"use client";
import { useState } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  owner_name: string;
  property_address: string;
  city: string;
  state: string;
  motivation_score: number;
  out_of_state: boolean;
  tax_delinquent: boolean;
  vacant: boolean;
  ownership_years: number;
  estimated_equity: number;
  pipeline_status: string;
  notes: string;
}

const DEMO_LEADS: Lead[] = [
  { id: "1", owner_name: "John Smith", property_address: "123 Main St", city: "Austin", state: "TX", motivation_score: 72, out_of_state: true, tax_delinquent: true, vacant: false, ownership_years: 25, estimated_equity: 75, pipeline_status: "Contacted", notes: "" },
  { id: "2", owner_name: "Mary Johnson", property_address: "456 Oak Ave", city: "Dallas", state: "TX", motivation_score: 0, out_of_state: false, tax_delinquent: false, vacant: false, ownership_years: 5, estimated_equity: 30, pipeline_status: "New", notes: "" },
  { id: "3", owner_name: "Robert Davis", property_address: "789 Pine St", city: "Houston", state: "TX", motivation_score: 90, out_of_state: true, tax_delinquent: true, vacant: true, ownership_years: 22, estimated_equity: 95, pipeline_status: "Offer Sent", notes: "" },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-green-100 text-green-700"
      : score >= 40
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-500";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, Record<string, string>>>({});

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUploadStatus("Please upload a .csv file");
      return;
    }
    setUploading(true);
    setUploadStatus("Uploading and scoring leads...");
    const csvText = await file.text();
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csv: csvText, userId: "demo-user" }),
        }
      );
      if (res.ok) {
        setUploadStatus("Leads imported and scored successfully");
      } else {
        setUploadStatus("Import completed — check your leads table");
      }
    } catch {
      setUploadStatus("Upload sent — check n8n for results");
    }
    setUploading(false);
  };

  const analyzeLead = async (lead: Lead) => {
    setAnalyzing(lead.id);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_AI_ANALYZER_URL || "",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }
      );
      const data = await res.json();
      setAnalyses((prev) => ({ ...prev, [lead.id]: data }));
    } catch {
      setAnalyses((prev) => ({
        ...prev,
        [lead.id]: {
          summary: "Analysis failed. Please try again.",
          priority: "MEDIUM",
        },
      }));
    }
    setAnalyzing(null);
  };

  const PIPELINE_STAGES = [
  "New",
  "Contacted",
  "Interested",
  "Offer Sent",
  "Under Contract",
  "Closed",
  "Dead",
];

const updateStatus = (leadId: string, status: string) => {
  setLeads((prev) =>
    prev.map((l) => (l.id === leadId ? { ...l, pipeline_status: status } : l))
  );
};

const updateNotes = (leadId: string, notes: string) => {
  setLeads((prev) =>
    prev.map((l) => (l.id === leadId ? { ...l, notes } : l))
  );
};

const stageColor = (status: string) => {
  switch (status) {
    case "New": return "bg-gray-100 text-gray-600";
    case "Contacted": return "bg-blue-100 text-blue-700";
    case "Interested": return "bg-purple-100 text-purple-700";
    case "Offer Sent": return "bg-yellow-100 text-yellow-700";
    case "Under Contract": return "bg-orange-100 text-orange-700";
    case "Closed": return "bg-green-100 text-green-700";
    case "Dead": return "bg-red-100 text-red-500";
    default: return "bg-gray-100 text-gray-600";
  }
};
  const filtered = leads.filter(
    (l) =>
      l.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      l.property_address.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

  const highLeads = leads.filter((l) => l.motivation_score >= 70).length;
  const avgScore = Math.round(
    leads.reduce((a, b) => a + b.motivation_score, 0) / leads.length
  );

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
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">TR</div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total leads</p>
            <p className="text-3xl font-semibold text-gray-900">{leads.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">High priority</p>
            <p className="text-3xl font-semibold text-green-600">{highLeads}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Avg score</p>
            <p className="text-3xl font-semibold text-gray-900">{avgScore}</p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center mb-8 transition-colors ${
            dragOver ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-600 font-medium mb-1">Drop your PropStream CSV here</p>
          <p className="text-gray-400 text-sm mb-4">or click to browse your files</p>
          <label className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
            Choose CSV file
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {uploading && (
            <p className="mt-4 text-green-600 text-sm animate-pulse">{uploadStatus}</p>
          )}
          {!uploading && uploadStatus && (
            <p className="mt-4 text-green-600 text-sm">{uploadStatus}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your leads</h2>
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:border-green-400"
            />
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((lead) => (
              <div key={lead.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                      {lead.owner_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.owner_name}</p>
                      <p className="text-xs text-gray-400">
                        {lead.property_address}, {lead.city}, {lead.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {lead.out_of_state && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Out of state</span>
                    )}
                    {lead.tax_delinquent && (
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Tax delinquent</span>
                    )}
                    {lead.vacant && (
                      <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">Vacant</span>
                    )}
                    <ScoreBadge score={lead.motivation_score} />
                    <select
                      value={lead.pipeline_status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${stageColor(lead.pipeline_status)}`}
                    >
                     {PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                     ))}
                    </select>
                    <div className="flex gap-2 ml-2">
                      <button onClick={() => setEditingNotes(editingNotes === lead.id ? null : lead.id)} className="text-xs text-gray-500 hover:underline">
                        Notes {lead.notes ? "📝" : ""}
                      </button>
                      <button onClick={() => analyzeLead(lead)} disabled={analyzing === lead.id} className="text-xs text-purple-600 hover:underline disabled:opacity-50">
                        {analyzing === lead.id ? "Analyzing..." : "AI analyze"}
                      </button>
                      <Link href={`/dashboard/researcher/${lead.id}`} className="text-xs text-green-600 hover:underline">Research</Link>
                    </div>
                  </div>
                </div>
                {editingNotes === lead.id && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <textarea
                      value={lead.notes}
                      onChange={(e) => updateNotes(lead.id, e.target.value)}
                      placeholder="Add call notes, conversation history, next steps..."
                      className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-green-400 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 mt-1">Notes save automatically as you type</p>
                  </div>
                )}
                {analyses[lead.id] && (
                  <div className="mt-3 ml-13 bg-purple-50 border border-purple-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-700">AI Analysis</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        analyses[lead.id].priority === "HIGH"
                          ? "bg-green-100 text-green-700"
                          : analyses[lead.id].priority === "LOW"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {analyses[lead.id].priority}
                      </span>
                    </div>
                    {analyses[lead.id].summary && (
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Summary:</span> {analyses[lead.id].summary}
                      </p>
                    )}
                    {analyses[lead.id].motivation && (
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Motivation:</span> {analyses[lead.id].motivation}
                      </p>
                    )}
                    {analyses[lead.id].approach && (
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Approach:</span> {analyses[lead.id].approach}
                      </p>
                    )}
                    {analyses[lead.id].offer_range && (
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="font-medium">Offer range:</span> {analyses[lead.id].offer_range}
                      </p>
                    )}
                    {analyses[lead.id].risk && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-red-600">Risk:</span> {analyses[lead.id].risk}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}