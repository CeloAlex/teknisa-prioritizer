import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const hcm = await prisma.segmento.findUnique({ where: { nome: 'HCM' } })
if (!hcm) { console.error('Segmento HCM não encontrado'); process.exit(1) }

const result = await prisma.criterio.updateMany({
  where: { segmentoId: null },
  data:  { segmentoId: hcm.id },
})

console.log(`${result.count} critério(s) atribuídos ao segmento HCM (id=${hcm.id}).`)
await prisma.$disconnect()
