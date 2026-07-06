'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ensureSupabaseClient, exchangeAuthCallbackCode } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    ensureSupabaseClient().then((supabase) => {
      if (!active) return
      if (!supabase) {
        setError('Supabase is not configured.')
        return
      }

      exchangeAuthCallbackCode(supabase).then((message) => {
        if (!active) return
        if (message) {
          setError(message)
          return
        }
        router.replace('/')
      })
    })

    return () => {
      active = false
    }
  }, [router])

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Sign-in failed</h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium underline">
            Back to Sermon Studio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <p className="text-sm text-gray-600">Signing you in…</p>
    </main>
  )
}
