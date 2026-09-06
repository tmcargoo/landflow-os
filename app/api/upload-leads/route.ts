import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (!line.trim()) continue
    const row: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    row.push(current.trim())
    rows.push(row)
  }
  return rows
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const text = await file.text()
  const rows = parseCSV(text)
  
  if (rows.length < 2) {
    return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 })
  }

  const headers = rows[0].map(h => h.replace(/"/g, '').trim())

  const getCol = (row: string[], name: string) => {
    const idx = headers.indexOf(name)
    return idx >= 0 ? (row[idx] || '').replace(/"/g, '').trim() : ''
  }

  const leads = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 3) continue

    const firstName = getCol(row, 'Owner 1 First Name')
    const lastName = getCol(row, 'Owner 1 Last Name')
    const ownerName = `${firstName} ${lastName}`.trim() || 'Unknown Owner'

    const propertyState = getCol(row, 'State')
    const mailingState = getCol(row, 'Mailing State')
    const outOfState = mailingState !== '' && mailingState !== propertyState

    const equityRaw = getCol(row, 'Est. Equity').replace(/[$,]/g, '')
    const equity = parseFloat(equityRaw) || 0

    const mailingAddress = [
      getCol(row, 'Mailing Address'),
      getCol(row, 'Mailing City'),
      getCol(row, 'Mailing State'),
      getCol(row, 'Mailing Zip'),
    ].filter(Boolean).join(', ')

    let score = 50
    if (equity > 50000) score += 15
    if (equity > 100000) score += 10
    if (outOfState) score += 10
    if (getCol(row, 'Foreclosure Factor') !== '') score += 15
    if (score > 99) score = 99

    leads.push({
      user_id: user.id,
      owner_name: ownerName,
      property_address: getCol(row, 'Address'),
      city: getCol(row, 'City'),
      state: propertyState,
      zip: getCol(row, 'Zip'),
      apn: getCol(row, 'APN'),
      owner_address: mailingAddress,
      estimated_equity: equity || null,
      out_of_state: outOfState,
      tax_delinquent: false,
      vacant: false,
      motivation_score: score,
      pipeline_status: 'New Lead',
      notes: getCol(row, 'Notes'),
    })
  }

  if (leads.length === 0) {
    return NextResponse.json({ error: 'No valid leads found in CSV' }, { status: 400 })
  }

  const { error } = await supabase.from('leads').insert(leads)

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: leads.length })
}