import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const r = await prisma.criterio.updateMany({ where: { nome: 'Erro Crítico' }, data: { nome: 'Erro' } })
console.log(`Atualizado: ${r.count} registro(s)`)
await prisma.$disconnect()
