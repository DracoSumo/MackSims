import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { exchangeAuthCallbackCode } from './supabaseClient'

describe('exchangeAuthCallbackCode session ownership', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when a session already exists without re-exchanging', async () => {
    const exchangeCodeForSession = vi.fn()
    const getSession = vi.fn().mockResolvedValue({
      data: { session: { access_token: 'tok' } },
      error: null,
    })
    const supabase = {
      auth: { getSession, exchangeCodeForSession },
    } as unknown as SupabaseClient

    const result = await exchangeAuthCallbackCode(supabase)

    expect(result).toBeNull()
    expect(exchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('exchanges the code when no session exists yet', async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null })
    const getSession = vi.fn().mockResolvedValueOnce({ data: { session: null }, error: null })
    const supabase = {
      auth: { getSession, exchangeCodeForSession },
    } as unknown as SupabaseClient

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        location: { search: '?code=abc123' },
      },
    })

    const result = await exchangeAuthCallbackCode(supabase)

    expect(result).toBeNull()
    expect(exchangeCodeForSession).toHaveBeenCalledWith('abc123')
  })
})
