import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const SEGMENTOS = [
  { nome: 'HCM' },
  { nome: 'Tecfood' },
  { nome: 'Retail' },
  { nome: 'ERP' },
  { nome: 'SM/FM' },
  { nome: 'P&D' },
  { nome: 'Sistemas Internos' },
]

// Produtos existentes na base → segmento
const PRODUTOS = [
  { nome: 'Teknisa HCM',                 segmento: 'HCM' },
  { nome: 'Teknisa Portal do Funcionário',segmento: 'HCM' },
  { nome: 'Teknisa Portal do Gestor',     segmento: 'HCM' },
]

async function main() {
  // Segmentos
  for (const s of SEGMENTOS) {
    await prisma.segmento.upsert({
      where:  { nome: s.nome },
      update: {},
      create: s,
    })
    console.log(`  ✓ Segmento: ${s.nome}`)
  }

  // Produtos
  for (const p of PRODUTOS) {
    const seg = await prisma.segmento.findUnique({ where: { nome: p.segmento } })
    if (!seg) { console.warn(`  ⚠ Segmento '${p.segmento}' não encontrado`); continue }
    await prisma.produto.upsert({
      where: { nome: p.nome },
      update: { segmentoId: seg.id },
      create: { nome: p.nome, segmentoId: seg.id },
    })
    console.log(`  ✓ Produto: ${p.nome} → ${p.segmento}`)
  }

  console.log('\nSeed concluído.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
