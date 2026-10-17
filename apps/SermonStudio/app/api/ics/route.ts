// app/api/ics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { resolveIcsAccess, sermonVisibleToChurch } from '@/lib/icsAccess'

type SermonRow = {
  id: string
  title: string | null
  theme: string | null
  date: string | null            // YYYY-MM-DD
  start_time: string | null      // ISO string
  end_time: string | null        // ISO string
  location: string | null
  passages: string[] | null
  notes: string | null
  church_id: string | null
}

// Format a Date to ICS UTC date-time: YYYYMMDDTHHMMSSZ
function fmtDateTimeUTC(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${y}${m}${day}T${hh}${mm}${ss}Z`
}

// Escape newlines per RFC5545
function foldText(text: string): string {
  return text.replace(/\r?\n/g, '\\n')
}

function buildICS(sermons: SermonRow[]): string {
  const now = fmtDateTimeUTC(new Date())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pastor Sermon Studio//EN',
    'CALSCALE:GREGORIAN',
  ]

  for (const s of sermons) {
    const uid = `${s.id}@sermon-studio`
    const title = foldText(String(s.title ?? 'Sermon'))
    const desc = foldText(
      [
        s.theme ? `Theme: ${s.theme}` : '',
        Array.isArray(s.passages) && s.passages.length ? `Passages: ${s.passages.join(', ')}` : '',
        s.notes ? `Notes: ${s.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    )

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    lines.push(`DTSTAMP:${now}`)

    if (s.start_time) {
      // Date-time event
      const start = fmtDateTimeUTC(new Date(s.start_time))
      lines.push(`DTSTART:${start}`)
      if (s.end_time) {
        const end = fmtDateTimeUTC(new Date(s.end_time))
        lines.push(`DTEND:${end}`)
      }
    } else if (s.date) {
      // All-day event
      const d = new Date(`${s.date}T00:00:00Z`)
      const y = d.getUTCFullYear()
      const m = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      lines.push(`DTSTART;VALUE=DATE:${y}${m}${day}`)
    }

    lines.push(`SUMMARY:${title}`)
    if (s.location) lines.push(`LOCATION:${foldText(s.location)}`)
    if (desc) lines.push(`DESCRIPTION:${desc}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

async function resolveChurchId(
  sb: ReturnType<typeof createClient>,
  token: string,
): Promise<{ churchId: string | null; error: string | null; notFound?: boolean }> {
  const { data: ch, error: chErr } = await sb
    .from('churches')
    .select('id')
    .eq('feed_token', token)
    .maybeSingle()
  if (chErr) return { churchId: null, error: chErr.message }
  const churchId = (ch?.id as string | undefined) ?? null
  if (!churchId) return { churchId: null, error: null, notFound: true }
  return { churchId, error: null }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const access = resolveIcsAccess({
    sermonId: searchParams.get('sermonId'),
    token: searchParams.get('token'),
    from: searchParams.get('from'),
    to: searchParams.get('to'),
  })
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json(
      {
        error: 'ICS export requires Supabase service configuration',
        hint: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server',
      },
      { status: 503 }
    )
  }

  const sb = createClient(url, serviceKey)
  const { churchId, error: churchError, notFound } = await resolveChurchId(sb, access.token)
  if (churchError) {
    return NextResponse.json({ error: churchError }, { status: 500 })
  }
  if (notFound || !churchId) {
    return NextResponse.json({ error: 'Invalid church feed token' }, { status: 401 })
  }

  let sermons: SermonRow[] = []
  if (access.mode === 'single') {
    const { data, error } = await sb
      .from('sermons')
      .select('*')
      .eq('id', access.sermonId)
      .limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const row = ((data as SermonRow[]) || [])[0]
    // Same response for missing sermon and wrong-church — no cross-tenant oracle.
    if (!sermonVisibleToChurch(row, churchId)) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 })
    }
    sermons = [row]
  } else {
    let q = sb
      .from('sermons')
      .select('*')
      .eq('church_id', churchId)
      .order('date', { ascending: true })
    if (access.from) q = q.gte('date', access.from)
    if (access.to) q = q.lte('date', access.to)

    const { data, error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    sermons = (data as SermonRow[]) || []
  }

  const ics = buildICS(sermons)
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="sermons.ics"',
    },
  })
}
