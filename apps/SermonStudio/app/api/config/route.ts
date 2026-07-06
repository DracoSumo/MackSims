import { NextResponse } from 'next/server'

function isValidAnonKey(key: string): boolean {
  return key.length > 40 && key.startsWith('eyJ') && !key.includes('your-anon-key')
}

/** Runtime public config — avoids Netlify secret-scan scrubbing of static client bundles. */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ''
  const configured = Boolean(url && anon && isValidAnonKey(anon))
  return NextResponse.json({
    supabaseUrl: configured ? url : null,
    supabaseAnonKey: configured ? anon : null,
  })
}
