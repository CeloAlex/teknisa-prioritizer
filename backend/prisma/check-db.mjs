import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const criterios = await prisma.criterio.findMany({ orderBy: { peso: 'asc' } })
const segmentos = await prisma.segmento.findMany()

console.log('SEGMENTOS:', JSON.stringify(segmentos.map(s => ({ id: s.id, nome: s.nome })), null, 2))
console.log('\nCRITERIOS:', JSON.stringify(criterios.map(c => ({ id: c.id, nome: c.nome, segmentoId: c.segmentoId, peso: c.peso, ativo: c.ativo })), null, 2))
console.log(`\nTotal: ${criterios.length} critérios, ${criterios.filter(c => c.segmentoId === null).length} sem segmentoId`)

await prisma.$disconnect()
