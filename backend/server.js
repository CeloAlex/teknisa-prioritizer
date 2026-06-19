import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { PrismaClient } from './generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const dbUrl = process.env.DB_URL || process.env.DATABASE_URL
console.log('DB_URL definida:', !!dbUrl, dbUrl ? '(primeiros 30 chars: ' + dbUrl.slice(0, 30) + '...)' : '(VAZIA/INDEFINIDA)')
const dbKeys = Object.keys(process.env).filter(k => /database|db|pg|postgres|railway/i.test(k))
console.log('Variáveis disponíveis:', dbKeys)

const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT != null
const adapter = new PrismaPg({
  connectionString: dbUrl,
  ...(isProduction ? { ssl: { rejectUnauthorized: false } } : {}),
})
const prisma = new PrismaClient({ adapter })
const app = Fastify({ logger: true })

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function normStr(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

/**
 * Mirrors the frontend findClient() logic.
 * Returns the canonical client nome that best matches issueClientName,
 * using: (1) exact norm match, (2) depara with includes, (3) word-by-word.
 */
function matchClientName(issueClientName, clientNorms, deparaIndex) {
  const norm = normStr(issueClientName)
  if (!norm) return null

  // 1. Exact normalized match
  let found = clientNorms.find(c => c.norm === norm)
  if (found) return found.nome

  // 2. Depara — exact, then one-side includes
  const dp = deparaIndex.find(d =>
    d.issueNorm === norm ||
    norm.includes(d.issueNorm) ||
    d.issueNorm.includes(norm)
  )
  if (dp) {
    found = clientNorms.find(c => c.norm === dp.clientNorm)
    if (found) return found.nome
  }

  // 3. Word-by-word (words > 3 chars)
  const words = norm.split(/\s+/).filter(w => w.length > 3)
  for (const w of words) {
    found = clientNorms.find(c => c.norm.includes(w))
    if (found) return found.nome
  }

  return null
}

async function recomputeAllQtdImpeditivas(prisma) {
  const [clients, deparas, impdIssues] = await Promise.all([
    prisma.client.findMany({ select: { nome: true } }),
    prisma.depara.findMany(),
    prisma.issue.findMany({ where: { impeditiva: true }, select: { cliente: true } }),
  ])

  const clientNorms  = clients.map(c => ({ nome: c.nome, norm: normStr(c.nome) }))
  const deparaIndex  = deparas.map(d => ({
    issueNorm:  normStr(d.nomeClienteIssue),
    clientNorm: normStr(d.nomeCliente),
  }))

  const counts = new Map(clients.map(c => [c.nome, 0]))
  for (const issue of impdIssues) {
    const nome = matchClientName(issue.cliente, clientNorms, deparaIndex)
    if (nome && counts.has(nome)) counts.set(nome, counts.get(nome) + 1)
  }

  await Promise.all(
    clients.map(c =>
      prisma.client.update({ where: { nome: c.nome }, data: { qtdImpeditivas: counts.get(c.nome) ?? 0 } })
    )
  )
}

// ── Issues ──────────────────────────────────────────────────────────────────

app.get('/api/issues', async () => {
  const [issues, produtos] = await Promise.all([
    prisma.issue.findMany({ orderBy: { id: 'asc' } }),
    prisma.produto.findMany({ include: { segmento: true } }),
  ])
  const prodMap = new Map(produtos.map(p => [p.nome.toLowerCase().trim(), p]))
  return issues.map(issue => {
    const prod = issue.produto ? prodMap.get(issue.produto.toLowerCase().trim()) : null
    return {
      ...issue,
      segmento:      prod?.segmento?.nome  ?? null,
      segmentoOrdem: prod?.segmento?.ordem ?? 999,
    }
  })
})

app.post('/api/issues', async (req, reply) => {
  const { id, nome, categoria, cliente, produto, status, dataAbertura,
          roadmap, atendeMultiplos, valor, curva, observacao, impeditiva,
          aprovacao, motivoReprovacao } = req.body

  if (!id || !nome) {
    return reply.status(400).send({ error: 'id e nome são obrigatórios' })
  }

  const commonFields = {
    nome, categoria, cliente, produto, status,
    dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
    roadmap: Boolean(roadmap), atendeMultiplos: Boolean(atendeMultiplos),
    valor: valor != null ? Number(valor) : null, curva, observacao,
    impeditiva: impeditiva != null ? Boolean(impeditiva) : false,
    aprovacao: aprovacao ?? null,
    motivoReprovacao: motivoReprovacao ?? null,
  }

  const issue = await prisma.issue.upsert({
    where:  { id: Number(id) },
    update: commonFields,
    create: { id: Number(id), ...commonFields },
  })

  return issue
})

app.put('/api/issues/bulk-impeditiva', async (req, reply) => {
  const { ids, impeditiva } = req.body
  if (!ids?.length) return reply.status(400).send({ error: 'ids é obrigatório' })

  await prisma.issue.updateMany({
    where: { id: { in: ids.map(Number) } },
    data:  { impeditiva: Boolean(impeditiva) },
  })

  await recomputeAllQtdImpeditivas(prisma)

  return { updated: ids.length }
})

app.delete('/api/issues/:id', async (req, reply) => {
  const id = Number(req.params.id)
  await prisma.issue.delete({ where: { id } }).catch(() => null)
  return reply.status(204).send()
})

// ── Clients ─────────────────────────────────────────────────────────────────

app.get('/api/clients', async () => {
  return prisma.client.findMany({ orderBy: { nome: 'asc' }, include: { faturamentoSegmentos: true } })
})

app.post('/api/clients', async (req, reply) => {
  const { nome, aceite, faturamento, tipo, curva, riscoChurn, projeto, codigo } = req.body

  if (!nome) {
    return reply.status(400).send({ error: 'nome é obrigatório' })
  }

  const baseFields = {
    aceite: aceite ? new Date(aceite) : null,
    faturamento: faturamento != null ? Number(faturamento) : null,
    tipo, curva, riscoChurn: Boolean(riscoChurn), projeto: Boolean(projeto),
    codigo: codigo ?? null,
  }

  const client = await prisma.client.upsert({
    where:  { nome },
    update: baseFields,
    create: { nome, ...baseFields, qtdImpeditivas: 0 },
    include: { faturamentoSegmentos: true },
  })

  return client
})

// ── Faturamento por Segmento ─────────────────────────────────────────────────

app.put('/api/faturamento-segmentos', async (req, reply) => {
  const { clienteId, segmentoId, valor } = req.body
  if (!clienteId || !segmentoId || valor == null) {
    return reply.status(400).send({ error: 'clienteId, segmentoId e valor são obrigatórios' })
  }
  const fs = await prisma.faturamentoSegmento.upsert({
    where: { clienteId_segmentoId: { clienteId: Number(clienteId), segmentoId: Number(segmentoId) } },
    update: { valor: Number(valor) },
    create: { clienteId: Number(clienteId), segmentoId: Number(segmentoId), valor: Number(valor) },
  })
  return fs
})

app.delete('/api/faturamento-segmentos/:id', async (req, reply) => {
  await prisma.faturamentoSegmento.delete({ where: { id: Number(req.params.id) } }).catch(() => null)
  return reply.status(204).send()
})

// ── Depara ───────────────────────────────────────────────────────────────────

app.get('/api/depara', async () => {
  return prisma.depara.findMany({ orderBy: { nomeCliente: 'asc' } })
})

app.post('/api/depara', async (req, reply) => {
  const { nomeCliente, nomeClienteIssue } = req.body

  if (!nomeCliente || !nomeClienteIssue) {
    return reply.status(400).send({ error: 'nomeCliente e nomeClienteIssue são obrigatórios' })
  }

  const depara = await prisma.depara.upsert({
    where: { nomeCliente_nomeClienteIssue: { nomeCliente, nomeClienteIssue } },
    update: {},
    create: { nomeCliente, nomeClienteIssue },
  })

  return depara
})

// ── Segmentos ────────────────────────────────────────────────────────────────

app.get('/api/segmentos', async () => {
  return prisma.segmento.findMany({ orderBy: { id: 'asc' }, include: { produtos: true } })
})

app.post('/api/segmentos', async (req, reply) => {
  const { nome } = req.body
  if (!nome) return reply.status(400).send({ error: 'nome é obrigatório' })
  const segmento = await prisma.segmento.create({ data: { nome } })
  return segmento
})

app.put('/api/segmentos/:id', async (req, reply) => {
  const id   = Number(req.params.id)
  const data = {}
  if (req.body.nome != null) data.nome = req.body.nome
  return prisma.segmento.update({ where: { id }, data })
})

app.delete('/api/segmentos/:id', async (req, reply) => {
  await prisma.segmento.delete({ where: { id: Number(req.params.id) } }).catch(() => null)
  return reply.status(204).send()
})

// ── Produtos ─────────────────────────────────────────────────────────────────

app.get('/api/produtos', async () => {
  return prisma.produto.findMany({ orderBy: { nome: 'asc' }, include: { segmento: true } })
})

app.post('/api/produtos', async (req, reply) => {
  const { nome, segmentoId } = req.body
  if (!nome || !segmentoId) return reply.status(400).send({ error: 'nome e segmentoId são obrigatórios' })
  const produto = await prisma.produto.upsert({
    where: { nome },
    update: { segmentoId: Number(segmentoId) },
    create: { nome, segmentoId: Number(segmentoId) },
  })
  return produto
})

app.delete('/api/produtos/:id', async (req, reply) => {
  await prisma.produto.delete({ where: { id: Number(req.params.id) } }).catch(() => null)
  return reply.status(204).send()
})

// ── Criterios ────────────────────────────────────────────────────────────────

app.get('/api/criterios', async (req) => {
  const { segmentoId } = req.query
  const where = segmentoId != null ? { segmentoId: Number(segmentoId) } : {}
  return prisma.criterio.findMany({ where, orderBy: { peso: 'asc' } })
})

app.post('/api/criterios', async (req, reply) => {
  const { nome, peso, tipo, atributo, direcao, ativo, padrao, segmentoId } = req.body

  if (!nome || !tipo || !atributo || segmentoId == null) {
    return reply.status(400).send({ error: 'nome, tipo, atributo e segmentoId são obrigatórios' })
  }

  const criterio = await prisma.criterio.create({
    data: {
      nome,
      peso:       peso     != null ? Number(peso)      : 0,
      tipo,
      atributo,
      direcao:    direcao  ?? 'desc',
      ativo:      ativo    != null ? Boolean(ativo)    : true,
      padrao:     padrao   != null ? Boolean(padrao)   : false,
      segmentoId: Number(segmentoId),
    },
  })

  return criterio
})

app.put('/api/criterios/:id', async (req, reply) => {
  const id = Number(req.params.id)
  const { nome, peso, tipo, atributo, direcao, ativo } = req.body

  const data = {}
  if (nome      != null) data.nome     = nome
  if (peso      != null) data.peso     = Number(peso)
  if (tipo      != null) data.tipo     = tipo
  if (atributo  != null) data.atributo = atributo
  if (direcao   != null) data.direcao  = direcao
  if (ativo     != null) data.ativo    = Boolean(ativo)

  const criterio = await prisma.criterio.update({ where: { id }, data })
  return criterio
})

app.delete('/api/criterios/:id', async (req, reply) => {
  const id = Number(req.params.id)
  await prisma.criterio.delete({ where: { id } }).catch(() => null)
  return reply.status(204).send()
})

// ── Frontend estático ────────────────────────────────────────────────────────

await app.register(fastifyStatic, {
  root: join(__dirname, '..', 'frontend', 'dist'),
})

// SPA fallback: qualquer rota não-API retorna index.html (React Router / deep links)
app.setNotFoundHandler((req, reply) => {
  if (req.url.startsWith('/api')) {
    return reply.status(404).send({ error: 'Rota não encontrada' })
  }
  return reply.sendFile('index.html')
})

// ── Start ───────────────────────────────────────────────────────────────────

try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
