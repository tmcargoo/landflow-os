# LandFlow OS — Project Context for Claude

This file helps Claude understand the LandFlow OS codebase and continue development across sessions without losing context.

---

## What This Project Is

LandFlow OS is a multi-tenant SaaS platform for land real estate investors. Subscribers upload CSV lead lists, analyze deals with AI, skip trace owners, generate legal offer letters, manage their pipeline, and export leads for mail campaigns.

**Live URL:** landflow-os.vercel.app  
**GitHub:** tmcargoo/landflow-os  
**Owner:** Terry (PANAD)  
**Status:** Live in production, accepting subscribers

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS
- **Database + Auth:** Supabase (project: landflow-os, ID: ftolvxblyobelybkgkgr)
- **Hosting:** Vercel (auto-deploys from GitHub main branch)
- **AI:** Anthropic Claude API (claude-haiku-4-5) via server-side API route
- **Skip Tracing:** Tracerfy REST API (POST /v1/api/trace/lookup/)
- **Automation:** n8n self-hosted on Hostinger VPS
- **Payments:** Stripe (test mode — switch to live before accepting real payments)
- **Dev Environment:** Windows PC, PowerShell, VS Code, localhost:3000

---

## Shipped Features (All Live)

1. **Supabase Auth** — login, logout, password reset, route protection via middleware.ts
2. **CSV Upload** — PropStream-compatible CSV parser, saves to Supabase leads table
3. **Lead Pipeline Dashboard** — real leads from Supabase, pipeline stage tracking, call notes
4. **AI Deal Analyzer** — n8n webhook → Claude Haiku, results shown on lead cards
5. **Skip Tracing** — Tracerfy API, returns phones/emails/DNC/TCPA flags, litigator warning
6. **Offer Letter Generator** — verbatim Joe McCall template, mail-merge only, prints/downloads
7. **Purchase Agreement** — generated with offer letter, same Joe McCall template
8. **Kanban Board** — draggable cards by pipeline stage (uses demo leads, not connected to Supabase yet)
9. **Company Settings** — stored in company_profiles table, auto-fills offer letters
10. **Scoring Weight Editor** — sliders per factor, saves to scoring_weights table, recalculates all leads
11. **Mail Merge Export** — filter by stage, checkbox selection, downloads CSV, logs to campaign_logs
12. **CSV Template Download** — /api/csv-template returns pre-formatted template

---

## File Structure

```
app/
  api/
    csv-template/route.ts
    generate-offer/route.ts
    skip-trace/route.ts
    upload-leads/route.ts
    stripe/create-checkout/route.ts
  dashboard/
    page.tsx                  ← Main dashboard (real Supabase leads)
    kanban/page.tsx           ← Kanban board (demo leads — needs Supabase connection)
    offer-letter/page.tsx     ← Offer letter generator
    mail-merge/page.tsx       ← Mail merge export
    scoring/page.tsx          ← Scoring weight editor
    settings/page.tsx         ← Company profile settings
    researcher/[id]/page.tsx  ← Saturday Researcher (AI)
  login/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
  pricing/page.tsx
  layout.tsx
  page.tsx                    ← Landing page
lib/
  supabase-client.ts          ← Browser Supabase client (createBrowserClient)
  supabase-server.ts          ← Server Supabase client (createServerClient + cookies)
  logout-button.tsx           ← Reusable logout button component
middleware.ts                 ← Auth route guard (protects /dashboard/*)
```

---

## Supabase Tables

| Table | Key Columns |
|---|---|
| leads | id, user_id, owner_name, property_address, city, state, zip, apn, owner_address, estimated_equity, out_of_state, tax_delinquent, vacant, motivation_score, pipeline_status, notes |
| company_profiles | user_id (unique), company_name, company_address, company_phone, company_email, investor_name |
| scoring_weights | user_id (unique), equity_weight, out_of_state_weight, foreclosure_weight, tax_delinquent_weight, vacant_weight |
| campaign_logs | user_id, lead_id, campaign_type, exported_at |
| skip_trace_results | user_id, lead_id, phones (jsonb), emails (jsonb), mailing_address (jsonb), litigator |

All tables have RLS enabled. Policy: `auth.uid() = user_id`

---

## Critical Rules

### Offer Letter Template
- Joe McCall's verbatim legal template — NEVER rewrite or rephrase
- Mail-merge only: fill in blanks, do not alter template language
- Only the contact method opening phrase changes based on how seller made first contact
- Contact phrases: "responding to our direct mail" / "calling us" / "responding to our advertisement" / "reaching out through our online ad" / "reaching out based on a referral"

### No Vendor Lock-in Language
- Never mention PropStream by name in the UI
- Upload features should say "Upload Leads CSV" not "Upload PropStream CSV"
- Mail merge export should be described as compatible with "any mail house"

### Skip Tracing is Backend-Only
- Tracerfy is invisible to subscribers
- Never expose Tracerfy branding or API details in the UI
- Skip trace results appear as native LandFlow OS data

### Code Delivery Rules (for Terry, non-programmer)
- Complete copy-paste blocks only, never partial snippets without context
- Max 30–40 lines per PowerShell paste (terminal limit)
- For full file replacements: use VS Code Ctrl+A → delete → paste
- Always state clearly which file to edit and where the edit goes
- Never give instructions that say "add X" without showing exactly where X goes

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
TRACERFY_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_STARTER_PRICE_ID
STRIPE_PRO_PRICE_ID
NEXT_PUBLIC_AI_ANALYZER_URL
NEXT_PUBLIC_BASE_URL
```

---

## n8n Webhooks

- **AI Deal Analyzer (production):** `POST https://n8n-przf.srv1166885.hstgr.cloud/webhook/analyze-lead`
- Test mode uses `/webhook-test/` prefix — never use in production
- Claude API response format uses `**LABEL:**` bold syntax — requires regex matching, not string splitting

---

## Known Issues / Technical Debt

- `middleware.ts` shows deprecation warning in Next.js 16 — should eventually rename to `proxy.ts`
- Kanban board (`app/dashboard/kanban/page.tsx`) uses hardcoded demo leads — needs connecting to Supabase leads table
- Supabase free tier auto-pauses after 7 days — upgrade to Pro recommended
- Stripe is in test mode — must switch to live before accepting real payments
- No automated tests — all testing is manual

---

## Remaining Nice-to-Have Features

1. Connect Kanban board to real Supabase leads
2. Google OAuth sign-in
3. In-app feedback mechanism (rating + comment form → Supabase)
4. Usage tracking and skip trace limits per plan tier
5. Terms of Service and Privacy Policy pages
6. Improved landing page

---

## Development Workflow

1. Edit files locally in VS Code
2. Test at `http://localhost:3000` with `npm run dev` running
3. `git add .` → `git commit -m "message"` → `git push`
4. Vercel auto-deploys from GitHub main branch
5. Verify at landflow-os.vercel.app

**Terminal management:**
- Tab 1: `npm run dev` (keep running)
- Tab 2: git commands (open with + button in VS Code terminal panel)

---

*Last updated: September 2026*
