import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const DEFAULT_CRITERIOS = [
  { nome: 'Erro',                       peso: 0, tipo: 'issue',   atributo: 'isErro',          direcao: 'desc', padrao: true },
  { nome: 'SLA Estourado',              peso: 1, tipo: 'issue',   atributo: 'slaEstourado',    direcao: 'desc', padrao: true },
  { nome: 'Risco de Churn',             peso: 2, tipo: 'cliente', atributo: 'riscoChurn',      direcao: 'desc', padrao: true },
  { nome: 'Valor da Issue',             peso: 3, tipo: 'issue',   atributo: 'valor',           direcao: 'desc', padrao: true },
  { nome: 'É Roadmap',                  peso: 4, tipo: 'issue',   atributo: 'roadmap',         direcao: 'desc', padrao: true },
  { nome: 'Curva do Cliente',           peso: 5, tipo: 'cliente', atributo: 'curva',           direcao: 'asc',  padrao: true },
  { nome: 'Atende Múltiplos Clientes',  peso: 6, tipo: 'issue',   atributo: 'atendeMultiplos', direcao: 'desc', padrao: true },
  { nome: 'Dias em Aberto',             peso: 7, tipo: 'issue',   atributo: 'diasAberto',      direcao: 'desc', padrao: true },
]

async function main() {
  const hcm = await prisma.segmento.findUnique({ where: { nome: 'HCM' } })
  if (!hcm) {
    console.error('Segmento HCM não encontrado. Execute db:seed-segmentos primeiro.')
    process.exit(1)
  }

  // Orphaned criteria (segmentoId=null) left by migration — assign them first
  const orphaned = await prisma.criterio.count({ where: { segmentoId: null } })
  if (orphaned > 0) {
    await prisma.criterio.updateMany({ where: { segmentoId: null }, data: { segmentoId: hcm.id } })
    console.log(`  ✓ ${orphaned} critério(s) órfão(s) atribuídos ao segmento HCM.`)
  }

  // Check if HCM already has criteria
  const existingHcm = await prisma.criterio.count({ where: { segmentoId: hcm.id } })
  if (existingHcm > 0) {
    console.log(`Critérios HCM já existem (${existingHcm}). Pulando seed.`)
    return
  }

  for (const c of DEFAULT_CRITERIOS) {
    await prisma.criterio.create({ data: { ...c, ativo: true, segmentoId: hcm.id } })
    console.log(`  ✓ ${c.nome}`)
  }
  console.log(`\nSeed concluído: ${DEFAULT_CRITERIOS.length} critérios padrão criados para o segmento HCM.`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
