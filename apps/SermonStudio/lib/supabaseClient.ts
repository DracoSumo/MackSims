'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

function isValidAnonKey(key: string): boolean {
  return (
    key.length > 40 &&
    (key.startsWith('eyJ') || key.startsWith('sb_publishable_')) &&
    !key.includes('your-anon-key')
  )
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

export type OAuthProvider = 'google' | 'github' | 'facebook'

export const OAUTH_PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'github', label: 'GitHub' },
  { id: 'facebook', label: 'Facebook' },
]

/** Facebook is live in Meta + Supabase; allow an explicit false as an emergency kill switch. */
export function isFacebookAuthEnabled(): boolean {
  if (typeof process === 'undefined') return false
  return (process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH ?? 'true').trim().toLowerCase() === 'true'
}

export function isOAuthProviderEnabled(provider: OAuthProvider): boolean {
  if (provider === 'facebook') return isFacebookAuthEnabled()
  return true
}

const AUTH_RETURN_TO_KEY = 'sermon-studio.auth.returnTo'

export function sanitizeAuthReturnTo(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback
  }
  try {
    const parsed = new URL(value, 'https://sermon-studio.invalid')
    if (parsed.origin !== 'https://sermon-studio.invalid' || parsed.pathname === '/auth/callback') {
      return fallback
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}

export function rememberAuthReturnTo(value?: string): void {
  if (typeof window === 'undefined') return
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, sanitizeAuthReturnTo(value, current))
}

export function consumeAuthReturnTo(fallback = '/'): string {
  if (typeof window === 'undefined') return fallback
  const value = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY)
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY)
  return sanitizeAuthReturnTo(value, fallback)
}

export function getAuthCallbackUrl(): string {
  if (typeof window === 'undefined') return '/auth/callback'
  return `${window.location.origin}/auth/callback`
}

export async function signInWithOAuth(
  supabase: SupabaseClient,
  provider: OAuthProvider,
): Promise<string | null> {
  if (!isOAuthProviderEnabled(provider)) {
    return 'Facebook login is not enabled yet. Complete Meta + Supabase Facebook setup, then set NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true.'
  }
  rememberAuthReturnTo()
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
