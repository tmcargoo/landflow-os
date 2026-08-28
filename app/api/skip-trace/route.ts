import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { address, city, state, zip } = await request.json()

  if (!address || !city || !state) {
    return NextResponse.json(
      { error: 'Address, city, and state are required' },
      { status: 400 }
    )
  }

  const apiKey = process.env.TRACERFY_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Tracerfy API key not configured' },
      { status: 500 }
    )
  }

  const response = await fetch('https://tracerfy.com/v1/api/trace/lookup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      address,
      city,
      state,
      zip: zip || '',
      find_owner: true,
    }),
  })

  const text = await response.text()
  console.log('Tracerfy raw response:', text)
  console.log('Tracerfy status:', response.status)

  try {
    const data = JSON.parse(text)
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: `Tracerfy error: ${text.substring(0, 200)}` },
      { status: 500 }
    )
  }
}