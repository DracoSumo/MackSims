import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const chunkDir = path.join(root, '.next/static/chunks/app')
const pageChunk = fs.readdirSync(chunkDir).find((f) => f.startsWith('page-') && f.endsWith('.js'))
if (!pageChunk) throw new Error('page chunk not found')
const local = fs.readFileSync(path.join(chunkDir, pageChunk), 'utf8')
console.log('local chunk', pageChunk)
const marker = '"https://zipxwqkmenapnckwyzrh.supabase.co".trim(),t="'
const idx = local.indexOf(marker)
if (idx === -1) {
  console.log('local: marker not found')
} else {
  const start = idx + marker.length
  const end = local.indexOf('"', start)
  const anon = local.slice(start, end)
  console.log('local anon len', anon.length)
  console.log('local anon first4 codes', [...anon.slice(0, 4)].map((c) => c.charCodeAt(0)))
  console.log('local anon last4', anon.slice(-4))
  console.log('local starts eyJ', anon.startsWith('eyJ'))
}

const indexHtml = await fetch('https://sermon-studio-beta.netlify.app/').then((r) => r.text())
const prodChunkMatch = indexHtml.match(/\/_next\/static\/chunks\/app\/(page-[^"]+\.js)/)
const prodChunk = prodChunkMatch?.[1]
console.log('prod chunk', prodChunk ?? 'not found')
const prod = prodChunk
  ? await fetch(`https://sermon-studio-beta.netlify.app/_next/static/chunks/app/${prodChunk}`).then((r) => r.text())
  : ''
const idx2 = prod.indexOf(marker)
if (idx2 === -1) {
  console.log('prod: marker not found')
} else {
  const start = idx2 + marker.length
  const end = prod.indexOf('"', start)
  const anon = prod.slice(start, end)
  console.log('prod anon len', anon.length)
  console.log('prod anon first4 codes', [...anon.slice(0, 4)].map((c) => c.charCodeAt(0)))
  console.log('prod anon last4', anon.slice(-4))
  console.log('prod starts eyJ', anon.startsWith('eyJ'))
}
