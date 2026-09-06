import { NextResponse } from 'next/server'

export async function GET() {
  const headers = [
    'Address', 'City', 'State', 'Zip', 'APN',
    'Owner 1 First Name', 'Owner 1 Last Name',
    'Mailing Address', 'Mailing City', 'Mailing State', 'Mailing Zip',
    'Est. Equity', 'Foreclosure Factor', 'Notes'
  ].join(',')

  const example = [
    '123 Main St', 'Atlanta', 'GA', '30301', '123-456-789',
    'John', 'Smith',
    '456 Oak Ave', 'Dallas', 'TX', '75201',
    '75000', '', 'Called twice, interested'
  ].join(',')

  const csv = `${headers}\n${example}\n`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="landflow-leads-template.csv"',
    },
  })
}