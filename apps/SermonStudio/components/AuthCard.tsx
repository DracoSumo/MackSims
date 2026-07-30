'use client'

import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  isOAuthProviderEnabled,
  OAUTH_PROVIDERS,
  signInWithOAuth,
  useSupabase,
  type OAuthProvider,
} from '@/lib/supabaseClient'

type Props = {
  className?: string
  onSignedIn?: (user: User) => void
  onSignedOut?: () => void
}

export default function AuthCard({ className = '', onSignedIn, onSignedOut }: Props) {
  const { supabase, ready } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [oauthBusy, setOauthBusy] = useState<OAuthProvider | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const lastUserIdRef = useRef<string | null>(null)
  const onSignedInRef = useRef(onSignedIn)
  const onSignedOutRef = useRef(onSignedOut)

  useEffect(() => {
    onSignedInRef.current = onSignedIn
    onSignedOutRef.current = onSignedOut
  }, [onSignedIn, onSignedOut])

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return
    }
    let mounted = true
    setAuthLoading(true)

    supabase.auth.getUser()
      .then(({ data }) => {
        if (!mounted) return
        const nextUser = data.user ?? null
        setUser(nextUser)
        if (nextUser && lastUserIdRef.current !== nextUser.id) {
          onSignedInRef.current?.(nextUser)
        }
        lastUserIdRef.current = nextUser?.id ?? null
      })
      .catch(() => {
        if (mounted) setMsg('❌ Could not check your sign-in status. Try again.')
      })
      .finally(() => {
        if (mounted) setAuthLoading(false)
      })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u && lastUserIdRef.current !== u.id) onSignedInRef.current?.(u)
      if (!u && lastUserIdRef.current) onSignedOutRef.current?.()
      lastUserIdRef.current = u?.id ?? null
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  async function signUp() {
    if (!supabase) return
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    setBusy(false)
    setMsg(error ? `❌ ${error.message}` : '✅ Check your email to confirm (or sign in if confirmations are disabled).')
  }

  async function signIn() {
    if (!supabase) return
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    setMsg(error ? `❌ ${error.message}` : '✅ Signed in!')
    if (!error) { setEmail(''); setPassword('') }
  }

  async function signOut() {
    if (!supabase) return
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.signOut()
    setBusy(false)
    setMsg(error ? `❌ ${error.message}` : '👋 Signed out')
  }

  async function oauthSignIn(provider: OAuthProvider) {
    if (!supabase || !isOAuthProviderEnabled(provider)) return
    setOauthBusy(provider)
    setMsg('')
    const error = await signInWithOAuth(supabase, provider)
    if (error) {
      setMsg(`❌ ${error}`)
      setOauthBusy(null)
    }
  }

  if (!ready) {
    return (
      <div className={`text-xs text-gray-500 ${className}`} role="status" aria-live="polite">
        Checking cloud sync…
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Supabase not configured — local demo mode (browser storage only). Cloud sign-in controls stay hidden until URL + anon key are set.
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className={`text-xs text-gray-500 ${className}`} role="status" aria-live="polite">
        Checking sign-in status…
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} aria-busy={busy || oauthBusy !== null}>
      {user ? (
        <>
          <span className="text-sm text-gray-600">Signed in as {user.email}</span>
          <button type="button" className="btn btn-outline" onClick={signOut} disabled={busy}>
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </>
      ) : (
        <>
          {OAUTH_PROVIDERS.map(({ id, label }) => {
            const providerReady = isOAuthProviderEnabled(id)
            return (
              <button
                key={id}
                type="button"
                className="btn btn-outline"
                disabled={busy || oauthBusy !== null || !providerReady}
                title={
                  providerReady
                    ? `Continue with ${label}`
                    : 'Facebook login pending Meta + Supabase setup'
                }
                onClick={() => oauthSignIn(id)}
              >
                {oauthBusy === id ? 'Redirecting…' : providerReady ? label : `${label} (coming soon)`}
              </button>
            )
          })}
          <form className="flex flex-wrap items-center gap-2" aria-label="Email sign in" onSubmit={e => { e.preventDefault(); void signIn() }}>
            <label className="sr-only" htmlFor="sermon-auth-email">Email address</label>
            <input
              id="sermon-auth-email"
              className="input"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: 200, maxWidth: '100%' }}
              disabled={busy || oauthBusy !== null}
            />
            <label className="sr-only" htmlFor="sermon-auth-password">Password</label>
            <input
              id="sermon-auth-password"
              className="input"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: 160, maxWidth: '100%' }}
              disabled={busy || oauthBusy !== null}
            />
            <button type="submit" className="btn btn-primary" disabled={busy || oauthBusy !== null}>
              {busy ? 'Working…' : 'Sign in'}
            </button>
            <button type="button" className="btn" onClick={signUp} disabled={busy || oauthBusy !== null}>
              {busy ? 'Working…' : 'Sign up'}
            </button>
          </form>
        </>
      )}
      {msg && (
        <span className="text-xs text-gray-500 ml-2" role={msg.startsWith('❌') ? 'alert' : 'status'}>
          {msg}
        </span>
      )}
    </div>
  )
}
