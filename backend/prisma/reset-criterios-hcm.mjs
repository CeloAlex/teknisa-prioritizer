/**
 * Apaga todos os critérios do segmento HCM e recria os 8 critérios padrão.
 * Use quando os critérios ficarem corrompidos ou forem perdidos acidentalmente.
 *
 *   node prisma/reset-criterios-hcm.mjs
 */
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

const hcm = await prisma.segmento.findUnique({ where: { nome: 'HCM' } })
if (!hcm) { console.error('Segmento HCM não encontrado.'); process.exit(1) }

const { count: deleted } = await prisma.criterio.deleteMany({ where: { segmentoId: hcm.id } })
console.log(`  🗑  ${deleted} critério(s) HCM removidos.`)

for (const c of DEFAULT_CRITERIOS) {
  await prisma.criterio.create({ data: { ...c, ativo: true, segmentoId: hcm.id } })
  console.log(`  ✓  ${c.nome} (peso ${c.peso})`)
}

console.log(`\nReset concluído: ${DEFAULT_CRITERIOS.length} critérios padrão recriados para HCM.`)
await prisma.$disconnect()
