'use client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ensureSupabaseClient, getSupabaseClient } from '@/lib/supabaseClient'

export function getSupabase(): SupabaseClient | null {
  return getSupabaseClient()
}

export { ensureSupabaseClient }
