"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from '@/lib/logout-button';

const STAGES = [
  "New Lead",
  "Contacted",
  "Interested",
  "Offer Sent",
  "Under Contract",
  "Closed",
  "Dead",
];

const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-gray-100 text-gray-700",
  "Contacted": "bg-blue-100 text-blue-700",
  "Interested": "bg-purple-100 text-purple-700",
  "Offer Sent": "bg-yellow-100 text-yellow-700",
  "Under Contract": "bg-orange-100 text-orange-700",
  "Closed": "bg-green-100 text-green-700",
  "Dead": "bg-red-100 text-red-500",
};

const DEMO_LEADS = [
  { id: "1", owner_name: "John Smith", property_address: "123 Main St", city: "Atlanta", state: "GA", motivation_score: 85, stage: "New Lead" },
  { id: "2", owner_name: "Mary Johnson", property_address: "456 Oak Ave", city: "Dallas", state: "TX", motivation_score: 72, stage: "Contacted" },
  { id: "3", owner_name: "Robert Davis", property_address: "789 Pine Rd", city: "Phoenix", state: "AZ", motivation_score: 91, stage: "Interested" },
  { id: "4", owner_name: "Lisa Wilson", property_address: "321 Elm St", city: "Miami", state: "FL", motivation_score: 68, stage: "Offer Sent" },
  { id: "5", owner_name: "James Brown", property_address: "654 Maple Dr", city: "Denver", state: "CO", motivation_score: 79, stage: "New Lead" },
];

interface Lead {
  id: string;
  owner_name: string;
  property_address: string;
  city: string;
  state: string;
  motivation_score: number;
  stage: string;
}

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDrop = (stage: string) => {
    if (!draggingId) return;
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggingId ? { ...lead, stage } : lead
      )
    );
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
  };

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
          <Link href="/dashboard/kanban" className="text-sm text-green-600 font-medium">Kanban</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Upgrade</Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Pipeline Kanban Board</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div
                key={stage}
                className="min-w-[220px] bg-gray-100 rounded-xl p-3 flex flex-col gap-3"
                onDrop={() => handleDrop(stage)}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{stage}</span>
                  <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500 font-medium">
                    {stageLeads.length}
                  </span>
                </div>
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="bg-white rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing border border-gray-200"
                  >
                    <p className="text-sm font-semibold text-gray-900">{lead.owner_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lead.property_address}</p>
                    <p className="text-xs text-gray-400">{lead.city}, {lead.state}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-bold ${scoreColor(lead.motivation_score)}`}>
                        Score: {lead.motivation_score}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[lead.stage]}`}>
                        {lead.stage}
                      </span>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                    Drop here
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}