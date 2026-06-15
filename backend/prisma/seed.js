import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const raw = JSON.parse(readFileSync(join(__dirname, 'raw-data.json'), 'utf8'))

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function mapIssue(i) {
  return {
    id: Number(i.id),
    nome: i.n,
    categoria: i.cat || null,
    cliente: i.cl || null,
    produto: i.prod || null,
    status: i.st || null,
    dataAbertura: i.dt ? new Date(i.dt) : null,
    roadmap: Boolean(i.rm),
    atendeMultiplos: Boolean(i.mc),
    valor: i.val != null ? Number(i.val) : null,
    curva: i.curva || null,
    observacao: i.ob || null,
  }
}

function mapClient(c) {
  return {
    nome: c.n,
    aceite: c.ac ? new Date(c.ac) : null,
    faturamento: c.fat != null ? Number(c.fat) : null,
    tipo: c.tp || null,
    curva: c.cv || null,
    riscoChurn: Boolean(c.ch),
    projeto: Boolean(c.pr),
    qtdImpeditivas: c.im != null ? Number(c.im) : 0,
  }
}

async function main() {
  console.log('Inserindo issues...')
  let ok = 0
  for (const i of raw.issues) {
    const data = mapIssue(i)
    await prisma.issue.upsert({ where: { id: data.id }, update: data, create: data })
    ok++
  }
  console.log(`  ${ok}/${raw.issues.length} issues inseridas`)

  console.log('Inserindo clients...')
  ok = 0
  for (const c of raw.clients) {
    const data = mapClient(c)
    await prisma.client.upsert({ where: { nome: data.nome }, update: data, create: data })
    ok++
  }
  console.log(`  ${ok}/${raw.clients.length} clients inseridos`)

  console.log('Inserindo depara...')
  ok = 0
  for (const d of raw.depara) {
    if (!d.c || !d.i) continue
    await prisma.depara.upsert({
      where: { nomeCliente_nomeClienteIssue: { nomeCliente: d.c, nomeClienteIssue: d.i } },
      update: {},
      create: { nomeCliente: d.c, nomeClienteIssue: d.i },
    })
    ok++
  }
  console.log(`  ${ok}/${raw.depara.length} depara inseridos`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
