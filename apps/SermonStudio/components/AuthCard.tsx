'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { signInWithOAuth, useSupabase, type OAuthProvider } from '@/lib/supabaseClient'

type Props = {
  className?: string
  onSignedIn?: (user: User) => void
  onSignedOut?: () => void
}

const oauthProviders: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'github', label: 'GitHub' },
]

export default function AuthCard({ className = '', onSignedIn, onSignedOut }: Props) {
  const { supabase, ready } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [oauthBusy, setOauthBusy] = useState<OAuthProvider | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!supabase) return
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data.user ?? null)
      if (data.user && onSignedIn) onSignedIn(data.user)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u && onSignedIn) onSignedIn(u)
      if (!u && onSignedOut) onSignedOut()
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [supabase, onSignedIn, onSignedOut])

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
    if (!supabase) return
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
      <div className={`text-xs text-gray-500 ${className}`}>
        Checking cloud sync…
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Supabase not configured — local demo mode (browser storage only).
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {user ? (
        <>
          <span className="text-sm text-gray-600">Signed in as {user.email}</span>
          <button className="btn btn-outline" onClick={signOut} disabled={busy}>Sign out</button>
        </>
      ) : (
        <>
          {oauthProviders.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="btn btn-outline"
              disabled={busy || oauthBusy !== null}
              title={`Continue with ${label}`}
              onClick={() => oauthSignIn(id)}
            >
              {oauthBusy === id ? '…' : label}
            </button>
          ))}
          <input
            className="input"
            placeholder="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: 200 }}
            disabled={busy}
          />
          <input
            className="input"
            type="password"
            placeholder="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: 160 }}
            disabled={busy}
          />
          <button className="btn btn-primary" onClick={signIn} disabled={busy}>Sign in</button>
          <button className="btn" onClick={signUp} disabled={busy}>Sign up</button>
        </>
      )}
      {msg && <span className="text-xs text-gray-500 ml-2">{msg}</span>}
    </div>
  )
}
