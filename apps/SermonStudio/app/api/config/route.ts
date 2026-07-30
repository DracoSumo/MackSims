import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function isValidAnonKey(key: string): boolean {
  return key.length > 40 && key.startsWith('eyJ') && !key.includes('your-anon-key')
}

/**
 * Runtime public config.
 * Do NOT read NEXT_PUBLIC_* here: Next inlines those at build time and Netlify
 * secret-scanning replaces the anon key with asterisks in the server bundle.
 */
export async function GET() {
  const url = (process.env.SUPABASE_URL || '').trim()
  const anon = (process.env.SUPABASE_ANON_KEY || '').trim()
  const configured = Boolean(url && anon && isValidAnonKey(anon))
  return NextResponse.json({
    supabaseUrl: configured ? url : null,
    supabaseAnonKey: configured ? anon : null,
  })
}