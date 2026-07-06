'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

function isValidAnonKey(key: string): boolean {
  return key.length > 40 && key.startsWith('eyJ') && !key.includes('your-anon-key')
}

type SupabaseConfig = { url: string; anon: string }

let client: SupabaseClient | null = null
let configured = false
let initPromise: Promise<SupabaseClient | null> | null = null

function readServerConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon || !isValidAnonKey(anon)) return null
  return { url, anon }
}

async function fetchClientConfig(): Promise<SupabaseConfig | null> {
  if (typeof window === 'undefined') return readServerConfig()
  try {
    const res = await fetch('/api/config', { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { supabaseUrl?: string | null; supabaseAnonKey?: string | null }
    const url = data.supabaseUrl?.trim() ?? ''
    const anon = data.supabaseAnonKey?.trim() ?? ''
    if (!url || !anon || !isValidAnonKey(anon)) return null
    return { url, anon }
  } catch {
    return null
  }
}

function createSupabaseClient(cfg: SupabaseConfig): SupabaseClient {
  return createClient(cfg.url, cfg.anon, {
    auth: { flowType: 'pkce', detectSessionInUrl: true },
  })
}

export async function ensureSupabaseClient(): Promise<SupabaseClient | null> {
  if (client) return client
  if (!initPromise) {
    initPromise = (async () => {
      const cfg = await fetchClientConfig()
      configured = cfg !== null
      if (!cfg) return null
      client = createSupabaseClient(cfg)
      return client
    })()
  }
  return initPromise
}

export function getSupabaseClient(): SupabaseClient | null {
  return client
}

export function isSupabaseConfigured(): boolean {
  return configured || client !== null
}

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(() => getSupabaseClient())
  const [ready, setReady] = useState(() => getSupabaseClient() !== null)

  useEffect(() => {
    let active = true
    ensureSupabaseClient().then((next) => {
      if (!active) return
      setSupabase(next)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  return { supabase, ready, configured: !!supabase }
}

export type OAuthProvider = 'google' | 'github'

export function getAuthCallbackUrl(): string {
  if (typeof window === 'undefined') return '/auth/callback'
  return `${window.location.origin}/auth/callback`
}

export async function signInWithOAuth(
  supabase: SupabaseClient,
  provider: OAuthProvider,
): Promise<string | null> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: getAuthCallbackUrl() },
  })
  return error?.message ?? null
}

export async function exchangeAuthCallbackCode(supabase: SupabaseClient): Promise<string | null> {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) return 'Missing OAuth code.'
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  return error?.message ?? null
}
