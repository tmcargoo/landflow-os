"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: 0,
    description: "Try LandFlow with a small list",
    color: "border-gray-200",
    button: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    features: [
      "25 leads max",
      "1 CSV import per month (50 rows)",
      "Basic motivation scoring",
      "No Saturday Researcher",
      "No Kanban scheduler",
    ],
    unavailable: [2, 3, 4] as number[],
    priceId: null,
  },
  {
    name: "Starter",
    price: 49,
    description: "For active land investors",
    color: "border-green-500",
    button: "bg-green-600 text-white hover:bg-green-700",
    badge: "Most popular",
    features: [
      "500 leads",
      "10 CSV imports per month",
      "Custom scoring weights",
      "Saturday Researcher",
      "Kanban scheduler",
    ],
    unavailable: [] as number[],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    name: "Pro",
    price: 99,
    description: "For teams and high volume",
    color: "border-gray-200",
    button: "bg-gray-900 text-white hover:bg-gray-700",
    features: [
      "Unlimited leads",
      "Unlimited CSV imports",
      "Custom scoring weights",
      "Saturday Researcher",
      "Kanban + API access",
    ],
    unavailable: [],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planName: string, priceId: string | undefined) => {
    if (!priceId) return;
    setLoading(planName);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName.toLowerCase(), priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(null);
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
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-gray-400">
            No per-lead fees. No hidden costs. Cancel any time.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl border-2 p-6 relative ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 text-sm">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    {plan.unavailable.includes(idx) ? (
                      <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs flex-shrink-0">
                        ✕
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs flex-shrink-0">
                        ✓
                      </span>
                    )}
                    <span className={plan.unavailable.includes(idx) ? "text-gray-300" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Link
                  href="/dashboard"
                  className={`w-full block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${plan.button}`}
                >
                  Get started free
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.name, plan.priceId)}
                  disabled={loading === plan.name}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${plan.button} disabled:opacity-50`}
                >
                  {loading === plan.name ? "Loading..." : `Start ${plan.name}`}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              ["Do I need to reformat my CSV?", "No. LandFlow automatically maps PropStream, BatchLeads, and DataTree column names. Just export and upload."],
              ["Can I cancel any time?", "Yes. Cancel from your account settings with one click. No questions asked."],
              ["What counts as a lead?", "Each row in your CSV is one lead. Duplicate APNs are detected and merged automatically."],
              ["Is my data private?", "Yes. Each account is fully isolated. Your leads are never shared or sold."],
            ].map(([q, a]) => (
              <div key={String(q)}>
                <p className="text-sm font-medium text-gray-800 mb-1">{q}</p>
                <p className="text-sm text-gray-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}