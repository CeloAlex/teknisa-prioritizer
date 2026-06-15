import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

// Zero out all issues' impeditiva (already false from DB default, but ensures consistency)
const i1 = await prisma.issue.updateMany({ data: { impeditiva: false } })
console.log(`Issues resetadas: ${i1.count}`)

// Zero out all clients' qtdImpeditivas
const c1 = await prisma.client.updateMany({ data: { qtdImpeditivas: 0 } })
console.log(`Clientes zerados: ${c1.count}`)

await prisma.$disconnect()
console.log('Inicialização concluída.')
