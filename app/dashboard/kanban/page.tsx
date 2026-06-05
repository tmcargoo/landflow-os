"use client";
import { useState } from "react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  column: "Researching" | "Sunday Callbacks" | "Tuesday Follow-ups";
  due: string;
  minutes: number;
  lead: string;
}

function generateTasks(hours: number): Task[] {
  const leads = [
    "John Smith — 123 Main St",
    "Mary Johnson — 456 Oak Ave",
    "Robert Davis — 789 Pine St",
    "Linda Wilson — 321 Elm St",
    "James Brown — 654 Cedar Ave",
    "Patricia Moore — 987 Maple Dr",
    "Michael Taylor — 147 Oak Blvd",
    "Barbara Anderson — 258 Pine Rd",
  ];

  const totalMinutes = hours * 60;
  const perLead = 30 + 15 + 10;
  const maxLeads = Math.floor(totalMinutes / perLead);
  const tasks: Task[] = [];

  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));
  const tuesday = new Date(today);
  tuesday.setDate(today.getDate() + ((2 - today.getDay() + 7) % 7 || 7));

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  for (let i = 0; i < Math.min(maxLeads, leads.length); i++) {
    const researchDay = new Date(today);
    researchDay.setDate(today.getDate() + i);

    tasks.push({
      id: `r-${i}`,
      title: `Research lead`,
      column: "Researching",
      due: fmt(researchDay),
      minutes: 30,
      lead: leads[i],
    });
    tasks.push({
      id: `c-${i}`,
      title: `Call owner`,
      column: "Sunday Callbacks",
      due: fmt(sunday),
      minutes: 15,
      lead: leads[i],
    });
    tasks.push({
      id: `f-${i}`,
      title: `Follow up`,
      column: "Tuesday Follow-ups",
      due: fmt(tuesday),
      minutes: 10,
      lead: leads[i],
    });
  }

  return tasks;
}

const COLUMNS = [
  { id: "Researching", color: "bg-blue-50 border-blue-100", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  { id: "Sunday Callbacks", color: "bg-green-50 border-green-100", badge: "bg-green-100 text-green-700", dot: "bg-green-400" },
  { id: "Tuesday Follow-ups", color: "bg-orange-50 border-orange-100", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
] as const;

type ColumnId = typeof COLUMNS[number]["id"];

export default function KanbanPage() {
  const [hours, setHours] = useState(5);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [generated, setGenerated] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  const generate = () => {
    setTasks(generateTasks(hours));
    setGenerated(true);
    setDone(new Set());
  };

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalMinutes = hours * 60;
  const usedMinutes = tasks.reduce((a, b) => a + b.minutes, 0);

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
          <span className="text-sm text-gray-900">Weekly Kanban</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h1 className="text-base font-semibold text-gray-900 mb-1">
            Weekly task scheduler
          </h1>
          <p className="text-sm text-gray-400 mb-5">
            Enter your available hours and LandFlow will plan your week automatically.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Available hours this week</span>
                <span className="font-semibold text-gray-900">{hours} hrs</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>1 hr</span>
                <span>20 hrs</span>
              </div>
            </div>
            <button
              onClick={generate}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 whitespace-nowrap"
            >
              Generate my week
            </button>
          </div>
          {generated && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm">
              <span className="text-gray-500">
                Leads scheduled:{" "}
                <strong className="text-gray-900">{tasks.length / 3}</strong>
              </span>
              <span className="text-gray-500">
                Time used:{" "}
                <strong className="text-gray-900">{usedMinutes} mins</strong>
              </span>
              <span className="text-gray-500">
                Time available:{" "}
                <strong className="text-gray-900">{totalMinutes} mins</strong>
              </span>
              <span className="text-gray-500">
                Tasks completed:{" "}
                <strong className="text-green-600">{done.size}</strong>
              </span>
            </div>
          )}
        </div>

        {generated && (
          <div className="grid grid-cols-3 gap-6">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.column === col.id);
              return (
                <div key={col.id} className={`rounded-xl border p-4 ${col.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <h2 className="text-sm font-semibold text-gray-800">
                        {col.id}
                      </h2>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleDone(task.id)}
                        className={`bg-white rounded-lg border border-gray-100 p-3 cursor-pointer hover:border-gray-200 transition-all ${done.has(task.id) ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center text-white text-xs ${done.has(task.id) ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                            {done.has(task.id) && "✓"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${done.has(task.id) ? "line-through text-gray-400" : "text-gray-800"}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {task.lead}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs text-gray-300">
                                {task.due}
                              </span>
                              <span className="text-xs text-gray-300">·</span>
                              <span className="text-xs text-gray-300">
                                {task.minutes} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!generated && (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-400 font-medium">Set your hours and click Generate</p>
            <p className="text-sm text-gray-300 mt-1">Your weekly task plan will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}