import { NextResponse } from 'next/server'

export async function GET() {
  const content = `LANDFLOW OS — SUBSCRIBER GUIDE
Version 1.0 | September 2026
===============================

GETTING STARTED
---------------
Logging In: Go to landflow-os.vercel.app, enter your email and password, and click Log In.

First-Time Setup: Click Settings in the top navigation. Enter your company name, address, phone, email, and your name as the investor. Click Save Settings.

THE DASHBOARD
-------------
Each lead card shows: owner name, property address, estimated equity, motivation score, pipeline stage, action buttons, and call notes.

Motivation Scores: Green (80+) = High | Yellow (60-79) = Medium | Red (below 60) = Low

Pipeline Stages: New Lead > Contacted > Interested > Offer Sent > Under Contract > Closed > Dead

UPLOADING LEADS
---------------
From the dashboard, click Choose File in the Upload Leads CSV area. Select your CSV file and wait for confirmation.

Required columns: Address, City, State, Zip, APN, Owner 1 First Name, Owner 1 Last Name, Mailing Address, Mailing City, Mailing State, Mailing Zip, Est. Equity, Foreclosure Factor, Notes.

Download Template: Click the Download Template link next to the upload area.

SKIP TRACING
------------
Click the Skip Trace button on any lead card. Results show phones, emails, mailing address, and compliance flags (DNC, TCPA, Litigator).

OFFER LETTER GENERATOR
-----------------------
Click Offer Letter in the navigation. Select a lead, choose the contact method, enter offer price and expiration date, then click Generate. Click Print/Download PDF to save.

MOTIVATION SCORE EDITOR
------------------------
Click Scoring in the navigation. Adjust sliders for each factor. Click Save Weights, then Recalculate All Scores.

KANBAN BOARD
------------
Click Kanban in the navigation. Drag and drop lead cards between pipeline stage columns.

MAIL MERGE EXPORT
-----------------
Click Mail Merge in the navigation. Filter by stage, select leads, click Export Selected Leads. A CSV downloads ready for any mail house.

TIPS
----
- Upload leads regularly
- Update pipeline stages as you work leads
- Add call notes after every contact
- Skip trace before calling - check DNC flags first
- Customize scoring weights to match your market

---
LandFlow OS - Built for land investors, by land investors.`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="LandFlow-OS-Subscriber-Guide.txt"',
    },
  })
}