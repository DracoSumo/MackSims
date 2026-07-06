
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { defaultOutline, type Sermon, type SermonOutline, type Series, type Song, type Verse } from '@/lib/types'

const TRANSLATIONS = [
  { id: 'KJV', name: 'King James Version (KJV)', license: 'Public Domain', available: true },
  { id: 'WEB', name: 'World English Bible (WEB)', license: 'Public Domain', available: true },
] as const

/** Shown in UI only — not selectable without publisher licenses and API wiring. */
const LICENSED_TRANSLATION_NOTICE =
  'ESV, NIV, NKJV, and CSB require publisher licenses. This beta defaults to public-domain KJV/WEB only.'

const FALLBACK_VERSES: Verse[] = [
  {
    ref: 'John 3:16',
    text: {
      KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      WEB: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.',
    },
    themes: ['salvation', 'love', 'gospel'],
  },
  {
    ref: 'Psalm 23:1',
    text: {
      KJV: 'The LORD is my shepherd; I shall not want.',
      WEB: 'The LORD is my shepherd; I shall not want.',
    },
    themes: ['trust', 'guidance', 'shepherd'],
  },
  {
    ref: 'Matthew 28:19-20',
    text: {
      KJV: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
      WEB: 'Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age. Amen.',
    },
    themes: ['mission', 'discipleship', 'great commission'],
  },
  {
    ref: 'Romans 12:2',
    text: {
      KJV: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
      WEB: 'Don\'t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.',
    },
    themes: ['transformation', 'holiness', 'mind'],
  },
]

const THEMES = ['faith','love','grace','hope','holiness','discipleship','mission','transformation','trust','praise']

const FALLBACK_SONGS: Song[] = [
  { id: 1, title: 'How Great Is Our God', artist: 'Chris Tomlin', themes: ['greatness','praise'], tempo: 'mid' },
  { id: 2, title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong UNITED', themes: ['faith','trust'], tempo: 'slow' },
  { id: 3, title: 'Reckless Love', artist: 'Cory Asbury', themes: ['love','grace'], tempo: 'mid' },
  { id: 4, title: 'Build My Life', artist: 'Pat Barrett', themes: ['holiness','surrender'], tempo: 'mid' },
  { id: 5, title: 'Graves Into Gardens', artist: 'Elevation Worship', themes: ['transformation','victory'], tempo: 'up' },
  { id: 6, title: 'The Blessing', artist: 'Kari Jobe & Elevation', themes: ['blessing','benediction'], tempo: 'slow' },
]

const TABS = ['Scripture','Ideas','Worship','Series','Library'] as const
type TabId = typeof TABS[number]

const LS_LIB = 'sermon-studio-lib'
const LS_SERIES = 'sermon-studio-series'
const LS_DRAFT = 'sermon-studio-draft'

function emptySermon(): Sermon {
  return { title:'', theme:'faith', date:'', passages:[], notes:'', setlist:[], isSeriesItem:false, seriesId:'', outline: defaultOutline() }
}

function demoSermon(): Sermon {
  return {
    title: 'Renewed Minds (Demo)',
    theme: 'transformation',
    date: '',
    passages: ['Romans 12:2'],
    notes: 'Pray for openness to change. Benediction from Psalm 23.',
    setlist: [],
    isSeriesItem: true,
    seriesId: 'fall-2025-renew',
    outline: {
      keyPoints: [
        'God initiates transformation — we respond in faith.',
        'Renew the mind daily through Scripture and prayer.',
        'Practice three habits this week.',
      ],
      illustrations: ['The lighthouse — steady light in changing weather'],
      application: 'Choose one area to stop conforming and start transforming this week.',
    },
  }
}

/** Normalize a stored record (localStorage or Supabase row) into the current Sermon shape. */
function normalizeSermon(raw: any): Sermon {
  const o = raw?.outline
  const outline: SermonOutline = {
    keyPoints: Array.isArray(o?.keyPoints) ? o.keyPoints : [],
    illustrations: Array.isArray(o?.illustrations) ? o.illustrations : [],
    application: typeof o?.application === 'string' ? o.application : '',
  }
  return {
    id: raw?.id,
    title: raw?.title || '',
    theme: raw?.theme || 'faith',
    date: raw?.date || '',
    passages: Array.isArray(raw?.passages) ? raw.passages : [],
    notes: raw?.notes || '',
    setlist: Array.isArray(raw?.setlist) ? raw.setlist : [],
    isSeriesItem: raw?.isSeriesItem ?? raw?.is_series_item ?? false,
    seriesId: raw?.seriesId ?? raw?.series_id ?? '',
    outline,
  }
}

/** Local template suggestions — simple on-device string templates, not live AI. */
function suggestIdeas(theme: string, verses: Verse[]) {
  const verseThemes = new Set(verses.flatMap(r=>r.themes))
  const allThemes = new Set([theme, ...verseThemes].filter(Boolean))
  const bullets = [
    `Tension: Where are we conforming (Rom 12:2) instead of transforming?`,
    `Gospel: God's love initiates (John 3:16) — we respond in faith.`,
    `Practice: Three habits to renew the mind this week.`,
    `Mission: Everyday discipleship rhythms (Matt 28:19–20).`,
    `Comfort: The Shepherd's care in uncertainty (Ps 23).`,
  ]
  const lens = Array.from(allThemes).slice(0,3).join(', ')
  return [
    `Big Idea: A ${theme || 'Christ-centered'} life shaped by Scripture and Spirit.`,
    `Text Lens: ${lens || 'add passages to sharpen the lens'}.`,
    ...bullets
  ]
}

function randomColor() {
  const palette = ['#22c55e','#06b6d4','#a855f7','#f97316','#ef4444','#eab308','#3b82f6','#D946EF']
  return palette[Math.floor(Math.random()*palette.length)]
}

/** Assemble copy-ready plain-text sermon notes. */
function buildSermonNotes(sermon: Sermon, songs: Song[], seriesList: Series[], verses: Verse[], translation = 'KJV'): string {
  const outline = sermon.outline ?? defaultOutline()
  const seriesName = sermon.isSeriesItem && sermon.seriesId
    ? (seriesList.find(s=>s.id===sermon.seriesId)?.name || sermon.seriesId)
    : ''
  const setlistLines = sermon.setlist
    .map(id => songs.find(s=>s.id===id))
    .filter((s): s is Song => Boolean(s))
    .map(s => `- ${s.title} — ${s.artist}`)
  const lines: string[] = []
  lines.push(sermon.title || 'Untitled Sermon')
  lines.push('='.repeat((sermon.title || 'Untitled Sermon').length))
  if (sermon.date) lines.push(`Date: ${sermon.date}`)
  lines.push(`Theme: ${sermon.theme}`)
  if (seriesName) lines.push(`Series: ${seriesName}`)
  if (sermon.passages.length) {
    lines.push('', 'Passages:')
    sermon.passages.forEach(p => {
      lines.push(`- ${p}`)
      const verse = verses.find(v => v.ref === p)
      const text = verse?.text?.[translation] || verse?.text?.KJV
      if (text) lines.push(`  ${text}`)
    })
  }
  if (outline.keyPoints.length) {
    lines.push('', 'Key Points:')
    outline.keyPoints.forEach((p, i) => lines.push(`${i+1}. ${p}`))
  }
  if (outline.illustrations.length) {
    lines.push('', 'Illustrations:')
    outline.illustrations.forEach(p => lines.push(`- ${p}`))
  }
  if (outline.application.trim()) {
    lines.push('', 'Application:', outline.application.trim())
  }
  if (sermon.notes.trim()) {
    lines.push('', 'Notes:', sermon.notes.trim())
  }
  if (setlistLines.length) {
    lines.push('', 'Worship Setlist:')
    lines.push(...setlistLines)
  }
  lines.push('', '— Prepared with Pastor\'s Sermon Studio (beta)')
  return lines.join('\n')
}

/** Small reusable editor for a list of short text entries (key points, illustrations). */
function StringListEditor({ label, placeholder, items, onChange, ordered=false }:{
  label: string; placeholder: string; items: string[]; onChange: (items: string[])=>void; ordered?: boolean
}) {
  const [draft, setDraft] = useState('')
  function add() {
    const v = draft.trim()
    if (!v) return
    onChange([...items, v])
    setDraft('')
  }
  return (
    <div>
      <label className='text-sm font-medium'>{label}</label>
      <div className='flex gap-2 mt-1'>
        <Input placeholder={placeholder} value={draft}
          onChange={e=>setDraft(e.target.value)}
          onKeyDown={e=>{ if (e.key==='Enter') { e.preventDefault(); add() } }} />
        <Button type='button' variant='outline' onClick={add}>Add</Button>
      </div>
      {items.length === 0
        ? <p className='text-xs text-gray-500 mt-2'>Nothing added yet.</p>
        : (
          <ul className='mt-2 space-y-1'>
            {items.map((item, idx) => (
              <li key={`${item}-${idx}`} className='flex items-start justify-between gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm'>
                <span className='min-w-0 break-words'>{ordered ? `${idx+1}. ${item}` : item}</span>
                <button className='text-gray-400 hover:text-red-600 shrink-0' aria-label={`Remove ${item}`}
                  onClick={()=>onChange(items.filter((_,i)=>i!==idx))}>×</button>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default function Page() {
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [activeTab, setActiveTab] = useState<TabId>('Scripture')
  const [translation, setTranslation] = useState('KJV')
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState('')
  const [tempo, setTempo] = useState('')

  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS)
  const [verses, setVerses] = useState<Verse[]>(FALLBACK_VERSES)
  const [series, setSeries] = useState<Series[]>([{ id: 'fall-2025-renew', name: 'Renewed: A Romans 12 Series', color: '#D946EF' }])
  const [library, setLibrary] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)

  const [sermon, setSermon] = useState<Sermon>(emptySermon())
  const [status, setStatus] = useState<{ kind: 'info'|'success'|'error'; text: string } | null>(null)
  const [newSeriesName, setNewSeriesName] = useState('')
  const hydrated = useRef(false)

  const outline = sermon.outline ?? defaultOutline()
  function setOutline(patch: Partial<SermonOutline>) {
    setSermon(s => ({ ...s, outline: { ...(s.outline ?? defaultOutline()), ...patch } }))
  }
  function notify(kind: 'info'|'success'|'error', text: string) {
    setStatus({ kind, text })
  }

  // Load from Supabase (when configured) or localStorage on init
  useEffect(()=>{
    (async()=>{
      try {
        if (supabase) {
          const { data: songRows } = await supabase.from('songs').select('*').order('id')
          if (songRows && songRows.length) setSongs(songRows as any)
          const { data: verseRows } = await supabase.from('verses').select('*')
          if (verseRows && verseRows.length) setVerses((verseRows as any).map((v:any)=>({ref:v.ref, text:v.text_by_translation ?? {}, themes:v.themes ?? []})))
          const { data: seriesRows } = await supabase.from('series').select('*').order('created_at',{ascending:false})
          if (seriesRows && seriesRows.length) setSeries(seriesRows as any)
          const { data: sermonRows } = await supabase.from('sermons').select('*').order('created_at',{ascending:false})
          if (sermonRows) setLibrary((sermonRows as any[]).map(normalizeSermon))
        } else {
          const raw = localStorage.getItem(LS_LIB)
          if (raw) setLibrary((JSON.parse(raw) as any[]).map(normalizeSermon))
          const rawS = localStorage.getItem(LS_SERIES)
          if (rawS) setSeries(JSON.parse(rawS))
          const rawD = localStorage.getItem(LS_DRAFT)
          if (rawD) {
            setSermon(normalizeSermon(JSON.parse(rawD)))
          } else if (!raw || JSON.parse(raw).length === 0) {
            setSermon(demoSermon())
          }
        }
      } catch {
        notify('error', 'Could not load saved data. Starting fresh — your previous data was left untouched.')
      } finally {
        hydrated.current = true
        setLoading(false)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // Persist to localStorage when no backend is configured
  useEffect(()=>{
    if (!supabase && hydrated.current) localStorage.setItem(LS_LIB, JSON.stringify(library))
  },[library, supabase])
  useEffect(()=>{
    if (!supabase && hydrated.current) localStorage.setItem(LS_SERIES, JSON.stringify(series))
  },[series, supabase])
  useEffect(()=>{
    if (!supabase && hydrated.current) localStorage.setItem(LS_DRAFT, JSON.stringify(sermon))
  },[sermon, supabase])

  const selectedPassages = useMemo(()=> sermon.passages.map(ref=>verses.find(v=>v.ref===ref)).filter(Boolean) as Verse[], [sermon.passages, verses])
  const ideas = useMemo(()=> suggestIdeas(sermon.theme, selectedPassages), [sermon.theme, selectedPassages])
  const scriptureResults = useMemo(()=>{
    const q = search.trim().toLowerCase()
    if (!q) return verses
    return verses.filter(v => v.ref.toLowerCase().includes(q) || v.themes.some(t=>t.includes(q)))
  },[search, verses])
  const songResults = useMemo(()=>{
    return songs.filter(s=>{
      const tm = theme ? s.themes.includes(theme) : true
      const pm = tempo ? s.tempo===tempo : true
      return tm && pm
    })
  },[songs, theme, tempo])

  function addPassage(ref: string) {
    setSermon(s=> ({...s, passages: Array.from(new Set([...s.passages, ref]))}))
  }
  function removePassage(ref: string) {
    setSermon(s=> ({...s, passages: s.passages.filter(r=>r!==ref)}))
  }
  function addSong(id: number) {
    setSermon(s=> ({...s, setlist: Array.from(new Set([...s.setlist, id]))}))
  }
  function removeSong(id: number) {
    setSermon(s=> ({...s, setlist: s.setlist.filter(x=>x!==id)}))
  }

  async function saveSermon() {
    const record: Sermon = { ...sermon, id: sermon.id || crypto.randomUUID(), outline: sermon.outline ?? defaultOutline() }
    if (supabase) {
      const payload = {
        title: record.title || 'Untitled Sermon',
        theme: record.theme,
        date: record.date || null,
        passages: record.passages,
        notes: record.notes,
        setlist: record.setlist,
        is_series_item: record.isSeriesItem,
        series_id: record.seriesId || null,
        outline: record.outline,
      }
      const { data, error } = await supabase.from('sermons').insert(payload).select('*').single()
      if (!error && data) {
        setLibrary(l => [normalizeSermon(data), ...l])
        setSermon(emptySermon())
        notify('success', 'Sermon saved to Supabase.')
        return
      }
      notify('error', `Save error (Supabase): ${error?.message || 'unknown'}`)
    } else {
      setLibrary(l => [record, ...l.filter(x => x.id !== record.id)])
      setSermon(emptySermon())
      notify('success', 'Sermon saved to this browser (local library).')
    }
  }

  async function createSeries(name: string) {
    const trimmed = name.trim()
    if (!trimmed) { notify('error', 'Enter a series name first.'); return }
    const rec: Series = { id: crypto.randomUUID(), name: trimmed, color: randomColor() }
    if (supabase) {
      const { data, error } = await supabase.from('series').insert({ name: rec.name, color: rec.color }).select('*').single()
      if (!error && data) {
        setSeries(arr => [data as any, ...arr])
        setNewSeriesName('')
        notify('success', `Series "${rec.name}" created.`)
        return
      }
      notify('error', `Series create error: ${error?.message || 'unknown'}`)
    } else {
      setSeries(arr => [rec, ...arr])
      setNewSeriesName('')
      notify('success', `Series "${rec.name}" created (saved in this browser).`)
    }
  }

  async function copySermonNotes() {
    const text = buildSermonNotes(sermon, songs, series, verses, translation)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        notify('success', 'Sermon notes copied to clipboard.')
        return
      }
      throw new Error('Clipboard API unavailable')
    } catch {
      // Fallback for browsers/contexts without the async Clipboard API
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        notify('success', 'Sermon notes copied to clipboard.')
      } catch {
        notify('error', 'Could not access the clipboard in this browser. Select the notes text manually instead.')
      }
    }
  }

  return (
    <div className='p-4 sm:p-6 max-w-7xl mx-auto space-y-6'>
      <div className='rounded-2xl border border-[rgba(126,184,218,0.22)] bg-[rgba(21,28,36,0.72)] px-4 py-3 text-sm text-[color:var(--ss-muted)] backdrop-blur-sm' role='note'>
        <strong className='text-[color:var(--ss-ink)]'>External beta — local demo mode.</strong>{' '}
        Your data stays in this browser only — clearing browser data clears your library.
        Idea suggestions are simple local templates, <strong className='text-[color:var(--ss-ink)]'>not live AI</strong>.
        Please send feedback to feedback@macksims.com.
      </div>

      <div className='rounded-[12px] border border-[rgba(126,184,218,0.18)] bg-[rgba(126,184,218,0.08)] px-4 py-3 text-sm text-[color:var(--ss-muted)]' role='note'>
        <strong className='text-[color:var(--ss-ink)]'>Start here:</strong> edit the demo sermon below → add key points → open <strong>Scripture</strong> →
        use <strong>Copy Sermon Notes</strong> → <strong>Save Draft</strong>.
      </div>

      <header className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-[color:var(--ss-ink)]'>Pastor&apos;s Sermon Studio</h1>
          <p className='text-sm text-[color:var(--ss-muted)]'>Draft sermons, plan series, curate worship, and stay on schedule.</p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={saveSermon}>Save Draft</Button>
          <Button variant='outline' onClick={copySermonNotes}>Copy Sermon Notes</Button>
        </div>
      </header>

      {status && (
        <div
          role='status'
          className={`rounded-xl border px-4 py-2 text-sm flex items-start justify-between gap-3 ${
            status.kind==='success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
            : status.kind==='error' ? 'border-red-300 bg-red-50 text-red-900'
            : 'border-gray-300 bg-gray-50 text-gray-700'
          }`}
        >
          <span>{status.text}</span>
          <button className='text-inherit opacity-60 hover:opacity-100' aria-label='Dismiss message' onClick={()=>setStatus(null)}>×</button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Sermon</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='md:col-span-2'>
              <label className='text-sm font-medium'>Title</label>
              <Input placeholder='e.g., Renewed Minds' value={sermon.title} onChange={e=>setSermon({...sermon, title: e.target.value})} />
            </div>
            <div>
              <label className='text-sm font-medium'>Theme</label>
              <select className='select' value={sermon.theme} onChange={(e)=>setSermon({...sermon, theme: e.target.value})}>
                {THEMES.map(t=> <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm font-medium'>Date</label>
              <Input type='date' value={sermon.date} onChange={e=>setSermon({...sermon, date: e.target.value})} />
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Switch id='series' checked={sermon.isSeriesItem} onCheckedChange={(v)=>setSermon({...sermon, isSeriesItem: v})} />
              <label htmlFor='series' className='text-sm'>Part of a series</label>
            </div>
            {sermon.isSeriesItem && (
              <select className='select w-64 max-w-full' value={sermon.seriesId} onChange={(e)=>setSermon({...sermon, seriesId: e.target.value})}>
                <option value=''>Select series</option>
                {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <StringListEditor
              label='Key Points'
              placeholder='e.g., God initiates; we respond'
              items={outline.keyPoints}
              onChange={keyPoints=>setOutline({ keyPoints })}
              ordered
            />
            <StringListEditor
              label='Illustrations'
              placeholder='e.g., The lighthouse story'
              items={outline.illustrations}
              onChange={illustrations=>setOutline({ illustrations })}
            />
          </div>

          <div>
            <label className='text-sm font-medium'>Application</label>
            <Textarea rows={3} placeholder='How should the congregation respond this week?' value={outline.application} onChange={e=>setOutline({ application: e.target.value })} />
          </div>

          <div>
            <label className='text-sm font-medium'>Notes</label>
            <Textarea rows={5} placeholder='Prayer requests, calls-to-action, benediction, extra illustrations...' value={sermon.notes} onChange={e=>setSermon({...sermon, notes: e.target.value})} />
          </div>

          <div className='flex flex-wrap gap-2'>
            {sermon.passages.length===0 && <p className='text-sm text-gray-500'>No passages attached yet — add them from the Scripture tab below.</p>}
            {sermon.passages.map(ref => (
              <Badge key={ref}>
                <span>{ref}</span>
                <button className='ml-2 text-gray-500' aria-label={`Remove ${ref}`} onClick={()=>removePassage(ref)}>×</button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        <div className='tabs' role='tablist' aria-label='Studio sections'>
          {TABS.map(tab => (
            <button
              key={tab}
              role='tab'
              aria-selected={activeTab===tab}
              className='tab'
              data-active={activeTab===tab}
              onClick={()=>setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <Card>
            <CardContent className='py-8 text-center text-sm text-gray-500'>Loading your studio…</CardContent>
          </Card>
        )}

        {!loading && activeTab==='Scripture' && (
        <Card>
          <CardHeader>
            <CardTitle>Browse Scripture</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2 flex gap-2'>
                <Input placeholder="Search by reference or theme (e.g., 'John 3:16' or 'trust')" value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <div>
                <select className='select' value={translation} onChange={(e)=>setTranslation(e.target.value)}>
                  {TRANSLATIONS.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {scriptureResults.map(v => (
                <Card key={v.ref}>
                  <CardHeader className='pb-2 flex flex-row items-center justify-between'>
                    <CardTitle className='text-base'>{v.ref}</CardTitle>
                    <div className='flex flex-wrap gap-1 justify-end'>
                      {v.themes.map(t => <span key={t} className='badge'>{t}</span>)}
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <p className='text-sm leading-relaxed'>{v.text[translation] || 'Translation not available in the local library.'}</p>
                    <div className='flex gap-2'>
                      <Button onClick={()=>addPassage(v.ref)}>Add to Sermon</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {scriptureResults.length===0 && (
                <p className='text-sm text-gray-500 md:col-span-2'>No passages match &quot;{search}&quot;. This beta ships with a small local verse library — try a broader search like &quot;trust&quot; or &quot;John&quot;.</p>
              )}
            </div>

            <p className='text-xs text-gray-500'>{LICENSED_TRANSLATION_NOTICE}</p>
          </CardContent>
        </Card>
        )}

        {!loading && activeTab==='Ideas' && (
        <Card>
          <CardHeader><CardTitle>Idea Gatherer</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium'>Sermon Theme</label>
                <select className='select' value={sermon.theme} onChange={e=>setSermon({...sermon, theme: e.target.value})}>
                  {THEMES.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className='md:col-span-2'>
                <label className='text-sm font-medium'>From Passages</label>
                <div className='flex flex-wrap gap-2'>
                  {selectedPassages.length===0 ? <p className='text-sm text-gray-500'>Add passages in the Scripture section to seed ideas.</p> : null}
                  {selectedPassages.map(p => <span key={p.ref} className='badge'>{p.ref}</span>)}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base'>Local Suggestions <span className='badge ml-2 align-middle'>not live AI</span></CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <ul className='list-disc ml-5 space-y-2 text-sm'>
                    {ideas.map((i, idx)=> <li key={idx}>{i}</li>)}
                  </ul>
                  <p className='text-xs text-gray-500'>These prompts come from simple templates built into the app. Real AI assistance requires configuration and is not enabled in this beta.</p>
                </CardContent>
              </Card>
              <div>
                <label className='text-sm font-medium'>Your Additions</label>
                <Textarea rows={10} placeholder='Add hooks, illustrations, testimonies, commentaries, and applications...' value={sermon.notes} onChange={e=>setSermon({...sermon, notes: e.target.value})} />
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {!loading && activeTab==='Worship' && (
        <Card>
          <CardHeader><CardTitle>Praise & Worship Setlist</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='text-sm font-medium'>Filter by Theme</label>
                <select className='select' value={theme} onChange={e=>setTheme(e.target.value)}>
                  <option value=''>Any</option>
                  {THEMES.map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className='text-sm font-medium'>Tempo</label>
                <select className='select' value={tempo} onChange={e=>setTempo(e.target.value)}>
                  <option value=''>Any</option>
                  <option value='slow'>Slow</option>
                  <option value='mid'>Mid</option>
                  <option value='up'>Upbeat</option>
                </select>
              </div>
              <div className='md:col-span-2 flex items-end'>
                <Button variant='outline' onClick={()=> setTheme(sermon.theme)}>Match Current Sermon Theme</Button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Card>
                <CardHeader className='pb-2'><CardTitle className='text-base'>Song Suggestions</CardTitle></CardHeader>
                <CardContent className='space-y-2'>
                  {songResults.map(s => (
                    <div key={s.id} className='flex items-center justify-between gap-2 p-2 rounded-xl border'>
                      <div className='min-w-0'>
                        <div className='font-medium truncate'>{s.title}</div>
                        <div className='text-xs text-gray-500'>{s.artist} • {s.tempo} • {s.themes.join(', ')}</div>
                      </div>
                      <Button onClick={()=>addSong(s.id)}>Add</Button>
                    </div>
                  ))}
                  {songResults.length===0 && <p className='text-sm text-gray-500'>No matches. Try a different filter.</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'><CardTitle className='text-base'>Current Setlist</CardTitle></CardHeader>
                <CardContent className='space-y-2'>
                  {sermon.setlist.map(id => {
                    const s = songs.find(x=>x.id===id)
                    if (!s) return null
                    return (
                      <div key={id} className='flex items-center justify-between gap-2 p-2 rounded-xl border'>
                        <div className='min-w-0'>
                          <div className='font-medium truncate'>{s.title}</div>
                          <div className='text-xs text-gray-500'>{s.artist}</div>
                        </div>
                        <Button variant='outline' onClick={()=>removeSong(id)}>Remove</Button>
                      </div>
                    )
                  })}
                  {sermon.setlist.length===0 && <p className='text-sm text-gray-500'>No songs yet. Add from suggestions.</p>}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        )}

        {!loading && activeTab==='Series' && (
        <Card>
          <CardHeader><CardTitle>Series Planner</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2'>
                <label className='text-sm font-medium'>Attach to Series</label>
                <div className='flex flex-wrap gap-2 items-center'>
                  <select className='select w-64 max-w-full' value={sermon.seriesId} onChange={(e)=>setSermon({...sermon, seriesId: e.target.value, isSeriesItem: true})}>
                    <option value=''>Select series</option>
                    {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className='flex items-end'>
                <div className='flex items-center gap-2'>
                  <Switch id='series2' checked={sermon.isSeriesItem} onCheckedChange={(v)=>setSermon({...sermon, isSeriesItem: v})} />
                  <label htmlFor='series2' className='text-sm'>Make current sermon part of selected series</label>
                </div>
              </div>
            </div>

            <div>
              <label className='text-sm font-medium'>New Series</label>
              <div className='flex flex-wrap gap-2 mt-1'>
                <Input placeholder='Series name, e.g., Advent 2026' value={newSeriesName}
                  onChange={e=>setNewSeriesName(e.target.value)}
                  onKeyDown={e=>{ if (e.key==='Enter') { e.preventDefault(); createSeries(newSeriesName) } }} />
                <Button variant='outline' onClick={()=>createSeries(newSeriesName)}>Create Series</Button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {series.length===0 && <p className='text-sm text-gray-500'>No series yet. Create one above to group sermons.</p>}
              {series.map(s => (
                <Card key={s.id} className='border' style={{ borderColor: s.color }}>
                  <CardHeader className='pb-2 flex flex-row justify-between items-center'>
                    <CardTitle className='text-base'>{s.name}</CardTitle>
                    <div className='w-3 h-3 rounded-full shrink-0' style={{ background: s.color }} />
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-500'>Attach saved sermons to this series from the library section.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {!loading && activeTab==='Library' && (
        <Card>
          <CardHeader><CardTitle>Saved Sermons & Schedule</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' onClick={()=>{
                const payload = { library, series, exportedAt: new Date().toISOString() }
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'sermon-studio-backup.json'
                a.click()
                URL.revokeObjectURL(url)
                notify('success', 'Library backup downloaded as JSON.')
              }}>Export JSON backup</Button>
              <Button variant='outline' onClick={()=>{
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'application/json,.json'
                input.onchange = async () => {
                  const file = input.files?.[0]
                  if (!file) return
                  try {
                    const parsed = JSON.parse(await file.text()) as { library?: Sermon[]; series?: Series[] }
                    if (parsed.library) setLibrary(parsed.library.map(normalizeSermon))
                    if (parsed.series) setSeries(parsed.series)
                    notify('success', 'Backup imported into this browser.')
                  } catch {
                    notify('error', 'Could not read backup file. Use a sermon-studio-backup.json export.')
                  }
                }
                input.click()
              }}>Import JSON backup</Button>
            </div>
            {library.length===0 && <p className='text-sm text-gray-500'>No saved sermons yet. Draft one above and click Save Draft.</p>}
            {library.map(s => (
              <div key={s.id} className='p-3 rounded-xl border flex flex-wrap items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='font-medium'>{s.title || 'Untitled Sermon'}</div>
                  <div className='text-xs text-gray-500'>
                    {s.date ? new Date(`${s.date}T00:00:00`).toDateString() : 'No date'} • Theme: {s.theme}
                    {s.isSeriesItem && s.seriesId ? ` • Series: ${series.find(x=>x.id===s.seriesId)?.name || s.seriesId}` : ''}
                  </div>
                  <div className='mt-1 flex flex-wrap gap-1'>
                    {s.passages.map((r:string)=> <span key={r} className='badge'>{r}</span>)}
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <Button variant='outline' onClick={()=>{
                    setSermon(normalizeSermon(s))
                    setActiveTab('Scripture')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    notify('info', `Loaded "${s.title || 'Untitled Sermon'}" into the editor above.`)
                  }}>Edit</Button>
                  {!supabase && <Button variant='destructive' onClick={()=>{
                    setLibrary(arr => arr.filter(x=> x.id !== s.id))
                    notify('info', 'Sermon deleted from this browser.')
                  }}>Delete</Button>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        )}
      </div>

      <footer className='pb-4 text-center text-xs text-gray-400'>
        Pastor&apos;s Sermon Studio — external beta. Works fully offline in this browser; connect Supabase to sync across devices.
      </footer>
    </div>
  )
}
