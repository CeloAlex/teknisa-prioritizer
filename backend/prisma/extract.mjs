/**
 * Extrai o objeto RAW do App.jsx e salva como raw-data.json.
 * Executar uma vez: node prisma/extract.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../../frontend/src/App.jsx'), 'utf8')

const marker = 'const RAW = '
const start = src.indexOf(marker) + marker.length
const slice = src.slice(start)

let depth = 0, end = 0, inString = false, escape = false
for (let i = 0; i < slice.length; i++) {
  const c = slice[i]
  if (escape) { escape = false; continue }
  if (c === '\\' && inString) { escape = true; continue }
  if (c === '"') { inString = !inString; continue }
  if (inString) continue
  if (c === '{') depth++
  if (c === '}') { depth--; if (depth === 0) { end = i + 1; break } }
}

const raw = JSON.parse(slice.slice(0, end))
const out = join(__dirname, 'raw-data.json')
writeFileSync(out, JSON.stringify(raw, null, 2), 'utf8')
console.log(`raw-data.json salvo: ${raw.issues?.length} issues, ${raw.clients?.length} clients, ${raw.depara?.length} depara`)
