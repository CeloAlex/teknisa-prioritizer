import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multipart from '@fastify/multipart'
import { imageSize } from 'image-size'
import { PrismaClient } from './generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { buildDocx } from './lib/docxGenerator.js'
import { buildPdf } from './lib/pdfGenerator.js'
import { gerarRequisitos, editarImagem } from './lib/llm.js'
import { extractText } from './lib/extractText.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error('JWT_SECRET não definida. Configure a variável de ambiente antes de iniciar o servidor.')
  process.exit(1)
}

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

async function applyMigrations() {
  const steps = [
    `ALTER TABLE "Issue" ADD COLUMN IF NOT EXISTS "aprovacao" TEXT`,
    `ALTER TABLE "Issue" ADD COLUMN IF NOT EXISTS "motivoReprovacao" TEXT`,
    `ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "codigo" TEXT`,
    `CREATE TABLE IF NOT EXISTS "FaturamentoSegmento" (
       id          SERIAL           PRIMARY KEY,
       "clienteId"  INTEGER NOT NULL REFERENCES "Client"(id)   ON DELETE CASCADE,
       "segmentoId" INTEGER NOT NULL REFERENCES "Segmento"(id) ON DELETE CASCADE,
       valor       DOUBLE PRECISION NOT NULL,
       UNIQUE("clienteId", "segmentoId")
     )`,
  ]
  for (const sql of steps) {
    await prisma.$executeRawUnsafe(sql)
  }
  console.log('[migration] schema up to date')
}
await applyMigrations()

async function ensureFirstAdmin() {
  const existingAdmin = await prisma.operador.findFirst({ where: { papel: 'ADMIN' } })
  if (existingAdmin) return
  const senhaHash = await bcrypt.hash('Teknisa1..', 10)
  await prisma.operador.upsert({
    where: { email: 'marcelo@teknisa.com' },
    update: {},
    create: {
      nome: 'Marcelo Silva',
      email: 'marcelo@teknisa.com',
      senhaHash,
      papel: 'ADMIN',
      deveTrocarSenha: true,
    },
  })
  console.log('[seed] operador administrador inicial criado (marcelo@teknisa.com)')
}
await ensureFirstAdmin()

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

await app.register(multipart, {
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
})

// ── Auth ─────────────────────────────────────────────────────────────────────

const PUBLIC_ROUTES = new Set(['/api/auth/login'])

function signToken(operador) {
  return jwt.sign({ operadorId: operador.id }, JWT_SECRET, { expiresIn: '12h' })
}

function serializeOperador(operador) {
  return {
    id: operador.id,
    nome: operador.nome,
    email: operador.email,
    papel: operador.papel,
    ativo: operador.ativo,
    deveTrocarSenha: operador.deveTrocarSenha,
    segmentos: (operador.segmentos ?? []).map(s => ({ id: s.id, nome: s.nome })),
  }
}

app.addHook('preHandler', async (req, reply) => {
  if (!req.url.startsWith('/api')) return
  if (PUBLIC_ROUTES.has(req.url.split('?')[0])) return

  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return reply.status(401).send({ error: 'Não autenticado' })

  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch {
    return reply.status(401).send({ error: 'Sessão inválida ou expirada' })
  }

  const operador = await prisma.operador.findUnique({
    where: { id: payload.operadorId },
    include: { segmentos: true },
  })
  if (!operador || !operador.ativo) {
    return reply.status(401).send({ error: 'Operador inválido ou inativo' })
  }
  req.operador = operador
})

function requireRole(req, reply, roles) {
  if (!roles.includes(req.operador.papel)) {
    reply.status(403).send({ error: 'Você não tem permissão para executar esta ação' })
    return false
  }
  return true
}

app.post('/api/auth/login', async (req, reply) => {
  const { email, senha } = req.body ?? {}
  if (!email || !senha) return reply.status(400).send({ error: 'email e senha são obrigatórios' })

  const operador = await prisma.operador.findUnique({ where: { email }, include: { segmentos: true } })
  if (!operador || !operador.ativo) {
    return reply.status(401).send({ error: 'Credenciais inválidas' })
  }
  const ok = await bcrypt.compare(senha, operador.senhaHash)
  if (!ok) return reply.status(401).send({ error: 'Credenciais inválidas' })

  return { token: signToken(operador), operador: serializeOperador(operador) }
})

app.get('/api/auth/me', async (req) => {
  return serializeOperador(req.operador)
})

app.post('/api/auth/change-password', async (req, reply) => {
  const { senhaAtual, novaSenha } = req.body ?? {}
  if (!senhaAtual || !novaSenha) {
    return reply.status(400).send({ error: 'senhaAtual e novaSenha são obrigatórios' })
  }
  if (novaSenha.length < 6) {
    return reply.status(400).send({ error: 'A nova senha deve ter ao menos 6 caracteres' })
  }
  const ok = await bcrypt.compare(senhaAtual, req.operador.senhaHash)
  if (!ok) return reply.status(401).send({ error: 'Senha atual incorreta' })

  const senhaHash = await bcrypt.hash(novaSenha, 10)
  const updated = await prisma.operador.update({
    where: { id: req.operador.id },
    data: { senhaHash, deveTrocarSenha: false },
    include: { segmentos: true },
  })
  return serializeOperador(updated)
})

// ── Operadores ───────────────────────────────────────────────────────────────

app.get('/api/operadores', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  return prisma.operador.findMany({ orderBy: { nome: 'asc' }, include: { segmentos: true } })
    .then(ops => ops.map(serializeOperador))
})

app.post('/api/operadores', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  const { nome, email, senha, papel, segmentoIds } = req.body ?? {}
  if (!nome || !email || !senha || !papel) {
    return reply.status(400).send({ error: 'nome, email, senha e papel são obrigatórios' })
  }
  if (!['ADMIN', 'EDITOR', 'READONLY'].includes(papel)) {
    return reply.status(400).send({ error: 'papel inválido' })
  }
  const senhaHash = await bcrypt.hash(senha, 10)
  const operador = await prisma.operador.create({
    data: {
      nome, email, senhaHash, papel,
      deveTrocarSenha: true,
      segmentos: papel === 'ADMIN' ? undefined : { connect: (segmentoIds ?? []).map(id => ({ id: Number(id) })) },
    },
    include: { segmentos: true },
  }).catch(e => {
    if (e.code === 'P2002') return reply.status(409).send({ error: 'Já existe um operador com este e-mail' })
    throw e
  })
  if (!operador) return
  return serializeOperador(operador)
})

app.put('/api/operadores/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  const id = Number(req.params.id)
  const { nome, email, papel, ativo, segmentoIds, novaSenha } = req.body ?? {}

  const data = {}
  if (nome  != null) data.nome  = nome
  if (email != null) data.email = email
  if (ativo != null) data.ativo = Boolean(ativo)
  if (papel != null) {
    if (!['ADMIN', 'EDITOR', 'READONLY'].includes(papel)) {
      return reply.status(400).send({ error: 'papel inválido' })
    }
    data.papel = papel
  }
  if (segmentoIds != null) {
    const effectivePapel = papel ?? (await prisma.operador.findUnique({ where: { id } }))?.papel
    data.segmentos = { set: effectivePapel === 'ADMIN' ? [] : segmentoIds.map(sid => ({ id: Number(sid) })) }
  }
  if (novaSenha) {
    data.senhaHash = await bcrypt.hash(novaSenha, 10)
    data.deveTrocarSenha = true
  }

  const operador = await prisma.operador.update({ where: { id }, data, include: { segmentos: true } })
    .catch(e => {
      if (e.code === 'P2002') return reply.status(409).send({ error: 'Já existe um operador com este e-mail' })
      throw e
    })
  if (!operador) return
  return serializeOperador(operador)
})

app.delete('/api/operadores/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  const id = Number(req.params.id)
  await prisma.operador.update({ where: { id }, data: { ativo: false } }).catch(() => null)
  return reply.status(204).send()
})

// ── Parâmetros LLM ───────────────────────────────────────────────────────────

async function getParametroLLM() {
  return prisma.parametroLLM.findUnique({ where: { provider: 'openai' } })
}

app.get('/api/parametros/llm', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  const p = await getParametroLLM()
  return {
    configurado: !!p,
    apiKeyMascarada: p ? `••••${p.apiKey.slice(-4)}` : null,
    modeloTexto: p?.modeloTexto ?? 'gpt-4o',
    modeloImagem: p?.modeloImagem ?? 'gpt-image-1',
  }
})

app.put('/api/parametros/llm', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
  const { apiKey, modeloTexto, modeloImagem } = req.body ?? {}
  const existing = await getParametroLLM()
  if (!existing && !apiKey) {
    return reply.status(400).send({ error: 'Informe a apiKey na primeira configuração' })
  }
  const p = await prisma.parametroLLM.upsert({
    where: { provider: 'openai' },
    update: {
      ...(apiKey ? { apiKey } : {}),
      ...(modeloTexto ? { modeloTexto } : {}),
      ...(modeloImagem ? { modeloImagem } : {}),
    },
    create: {
      provider: 'openai',
      apiKey,
      modeloTexto: modeloTexto || 'gpt-4o',
      modeloImagem: modeloImagem || 'gpt-image-1',
    },
  })
  return {
    configurado: true,
    apiKeyMascarada: `••••${p.apiKey.slice(-4)}`,
    modeloTexto: p.modeloTexto,
    modeloImagem: p.modeloImagem,
  }
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

app.get('/api/issues', async (req) => {
  const [issues, produtos] = await Promise.all([
    prisma.issue.findMany({ orderBy: { id: 'asc' } }),
    prisma.produto.findMany({ include: { segmento: true } }),
  ])
  const prodMap = new Map(produtos.map(p => [p.nome.toLowerCase().trim(), p]))
  const enriched = issues.map(issue => {
    const prod = issue.produto ? prodMap.get(issue.produto.toLowerCase().trim()) : null
    return {
      ...issue,
      segmento:      prod?.segmento?.nome  ?? null,
      segmentoOrdem: prod?.segmento?.ordem ?? 999,
    }
  })

  if (req.operador.papel === 'ADMIN') return enriched
  const allowedSegmentos = new Set(req.operador.segmentos.map(s => s.nome))
  return enriched.filter(i => i.segmento && allowedSegmentos.has(i.segmento))
})

app.post('/api/issues', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const { id, nome, categoria, cliente, produto, status, dataAbertura,
          roadmap, atendeMultiplos, valor, curva, observacao, descricao, impeditiva,
          aprovacao, motivoReprovacao, segmentoId } = req.body

  if (!id || !nome) {
    return reply.status(400).send({ error: 'id e nome são obrigatórios' })
  }

  if (produto && segmentoId) {
    await prisma.produto.upsert({
      where:  { nome: produto },
      update: {},
      create: { nome: produto, segmentoId: Number(segmentoId) },
    })
  }

  const commonFields = {
    nome, categoria, cliente, produto, status,
    dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
    roadmap: Boolean(roadmap), atendeMultiplos: Boolean(atendeMultiplos),
    valor: valor != null ? Number(valor) : null, curva, observacao,
    descricao: descricao ?? null,
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
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
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
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const id = Number(req.params.id)
  await prisma.issue.delete({ where: { id } }).catch(() => null)
  return reply.status(204).send()
})

// ── Clients ─────────────────────────────────────────────────────────────────

app.get('/api/clients', async (req) => {
  const clients = await prisma.client.findMany({ orderBy: { nome: 'asc' }, include: { faturamentoSegmentos: true } })
  if (req.operador.papel === 'ADMIN') return clients
  return clients.map(({ faturamento, faturamentoSegmentos, ...rest }) => rest)
})

app.post('/api/clients', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const { nome, aceite, faturamento, tipo, curva, riscoChurn, projeto, codigo } = req.body

  if (!nome) {
    return reply.status(400).send({ error: 'nome é obrigatório' })
  }

  const baseFields = {
    aceite: aceite ? new Date(aceite) : null,
    tipo, curva, riscoChurn: Boolean(riscoChurn), projeto: Boolean(projeto),
    codigo: codigo ?? null,
  }
  // Faturamento só pode ser definido/alterado por Administrador — nunca sobrescrito por Editor.
  if (req.operador.papel === 'ADMIN') {
    baseFields.faturamento = faturamento != null ? Number(faturamento) : null
  }

  const client = await prisma.client.upsert({
    where:  { nome },
    update: baseFields,
    create: { nome, ...baseFields, faturamento: baseFields.faturamento ?? null, qtdImpeditivas: 0 },
    include: { faturamentoSegmentos: true },
  })
  if (req.operador.papel !== 'ADMIN') {
    const { faturamento: _f, faturamentoSegmentos: _fs, ...safe } = client
    return safe
  }

  return client
})

// ── Faturamento por Segmento ─────────────────────────────────────────────────

app.put('/api/faturamento-segmentos', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN'])) return
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
  if (!requireRole(req, reply, ['ADMIN'])) return
  await prisma.faturamentoSegmento.delete({ where: { id: Number(req.params.id) } }).catch(() => null)
  return reply.status(204).send()
})

// ── Depara ───────────────────────────────────────────────────────────────────

app.get('/api/depara', async () => {
  return prisma.depara.findMany({ orderBy: { nomeCliente: 'asc' } })
})

app.post('/api/depara', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
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
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const { nome } = req.body
  if (!nome) return reply.status(400).send({ error: 'nome é obrigatório' })
  const segmento = await prisma.segmento.create({ data: { nome } })
  return segmento
})

app.put('/api/segmentos/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const id   = Number(req.params.id)
  const data = {}
  if (req.body.nome != null) data.nome = req.body.nome
  return prisma.segmento.update({ where: { id }, data })
})

app.delete('/api/segmentos/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  await prisma.segmento.delete({ where: { id: Number(req.params.id) } }).catch(() => null)
  return reply.status(204).send()
})

// ── Produtos ─────────────────────────────────────────────────────────────────

app.get('/api/produtos', async () => {
  return prisma.produto.findMany({ orderBy: { nome: 'asc' }, include: { segmento: true } })
})

app.post('/api/produtos', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
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
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
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
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const { nome, peso, tipo, atributo, valor, direcao, ativo, padrao, segmentoId } = req.body

  if (!nome || !tipo || !atributo || segmentoId == null) {
    return reply.status(400).send({ error: 'nome, tipo, atributo e segmentoId são obrigatórios' })
  }

  const criterio = await prisma.criterio.create({
    data: {
      nome,
      peso:       peso     != null ? Number(peso)      : 0,
      tipo,
      atributo,
      valor:      valor    ?? null,
      direcao:    direcao  ?? 'desc',
      ativo:      ativo    != null ? Boolean(ativo)    : true,
      padrao:     padrao   != null ? Boolean(padrao)   : false,
      segmentoId: Number(segmentoId),
    },
  })

  return criterio
})

app.put('/api/criterios/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const id = Number(req.params.id)
  const { nome, peso, tipo, atributo, valor, direcao, ativo } = req.body

  const data = {}
  if (nome      != null) data.nome     = nome
  if (peso      != null) data.peso     = Number(peso)
  if (tipo      != null) data.tipo     = tipo
  if (atributo  != null) data.atributo = atributo
  if (valor     != null) data.valor    = valor
  if (direcao   != null) data.direcao  = direcao
  if (ativo     != null) data.ativo    = Boolean(ativo)

  const criterio = await prisma.criterio.update({ where: { id }, data })
  return criterio
})

app.delete('/api/criterios/:id', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const id = Number(req.params.id)
  await prisma.criterio.delete({ where: { id } }).catch(() => null)
  return reply.status(204).send()
})

// ── Especificação (documento gerado por IA) ──────────────────────────────────

const ACCEPTED_IMAGE_MIME = new Set(['image/png', 'image/jpeg'])
const ACCEPTED_DOC_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
])

function descreverErroOpenAI(e) {
  const code = e?.error?.code || e?.code
  if (code === 'credit_balance_exhausted' || code === 'insufficient_quota') {
    return 'A conta OpenAI configurada está sem créditos. Adicione créditos em platform.openai.com/settings/organization/billing e tente novamente.'
  }
  if (e?.status === 401 || code === 'invalid_api_key') {
    return 'A chave da OpenAI configurada em Parâmetros é inválida. Verifique e salve novamente.'
  }
  if (e?.status === 429) {
    return 'A OpenAI recusou a requisição por limite de uso (rate limit). Aguarde um instante e tente novamente.'
  }
  if (e?.status === 403) {
    return 'A conta OpenAI não tem permissão para usar o modelo configurado. Verifique a organização em platform.openai.com.'
  }
  return 'Não foi possível gerar os requisitos via IA. Tente novamente.'
}

async function getIssueSegmentoNome(issueProdutoNome) {
  if (!issueProdutoNome) return null
  const produtos = await prisma.produto.findMany({ include: { segmento: true } })
  const prod = produtos.find(p => p.nome.toLowerCase().trim() === issueProdutoNome.toLowerCase().trim())
  return prod?.segmento?.nome ?? null
}

app.get('/api/especificacoes', async () => {
  const rows = await prisma.especificacao.findMany({ select: { issueId: true } })
  return rows.map(r => r.issueId)
})

app.get('/api/issues/:id/especificacao', async (req, reply) => {
  const issueId = Number(req.params.id)
  const esp = await prisma.especificacao.findUnique({
    where: { issueId },
    include: { geradoPor: { select: { nome: true } } },
  })
  if (!esp) return { existe: false }
  return {
    existe: true,
    horasProgramacao: esp.horasProgramacao,
    horasTeste: esp.horasTeste,
    createdAt: esp.createdAt,
    geradoPorNome: esp.geradoPor?.nome ?? null,
  }
})

app.get('/api/issues/:id/especificacao/arquivo', async (req, reply) => {
  const issueId = Number(req.params.id)
  const formato = req.query.formato === 'pdf' ? 'pdf' : 'docx'
  const esp = await prisma.especificacao.findUnique({ where: { issueId } })
  if (!esp) return reply.status(404).send({ error: 'Documento não encontrado' })

  reply.header('Content-Disposition', `attachment; filename="Especificacao_${issueId}.${formato}"`)
  if (formato === 'pdf') {
    reply.type('application/pdf')
    return reply.send(esp.pdf)
  }
  reply.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  return reply.send(esp.docx)
})

app.post('/api/issues/:id/especificacao/gerar', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const issueId = Number(req.params.id)
  const issue = await prisma.issue.findUnique({ where: { id: issueId } })
  if (!issue) return reply.status(404).send({ error: 'Issue não encontrada' })

  const parametro = await getParametroLLM()
  if (!parametro) {
    return reply.status(400).send({ error: 'Configure a chave da OpenAI em Parâmetros antes de gerar uma especificação.' })
  }

  let contexto = ''
  const arquivos = []
  try {
    for await (const part of req.parts()) {
      if (part.type === 'file') {
        if (!ACCEPTED_IMAGE_MIME.has(part.mimetype) && !ACCEPTED_DOC_MIME.has(part.mimetype)) {
          return reply.status(400).send({ error: `Tipo de arquivo não suportado: ${part.mimetype}` })
        }
        const buffer = await part.toBuffer()
        arquivos.push({ buffer, mimeType: part.mimetype, filename: part.filename })
      } else if (part.fieldname === 'contexto') {
        contexto = part.value || ''
      }
    }
  } catch (e) {
    if (e.code === 'FST_REQ_FILE_TOO_LARGE') return reply.status(400).send({ error: 'Arquivo muito grande (máximo 8MB por arquivo).' })
    if (e.code === 'FST_FILES_LIMIT') return reply.status(400).send({ error: 'Máximo de 5 arquivos por geração.' })
    throw e
  }

  const segmentoNome = await getIssueSegmentoNome(issue.produto)
  const imagens = arquivos.filter(a => ACCEPTED_IMAGE_MIME.has(a.mimeType))
  const documentos = arquivos.filter(a => !ACCEPTED_IMAGE_MIME.has(a.mimeType))

  const textosDocs = (await Promise.all(documentos.map(d => extractText(d.buffer, d.mimeType)))).filter(Boolean)
  const anexosTexto = textosDocs.length ? textosDocs.join('\n\n---\n\n') : null

  let requisitos
  try {
    requisitos = await gerarRequisitos({
      issue: {
        id: issue.id, nome: issue.nome, categoria: issue.categoria, cliente: issue.cliente,
        produto: issue.produto, segmento: segmentoNome, descricao: issue.descricao,
      },
      contexto, anexosTexto,
      apiKey: parametro.apiKey, modelo: parametro.modeloTexto,
    })
  } catch (e) {
    req.log.error(e, 'Falha ao gerar requisitos via IA')
    return reply.status(502).send({ error: descreverErroOpenAI(e) })
  }

  const imagensEditadas = []
  for (const img of imagens) {
    try {
      const editada = await editarImagem({
        buffer: img.buffer, mimeType: img.mimeType,
        prompt: `Anote esta captura de tela de sistema para refletir visualmente a seguinte alteração: ${requisitos.objetivo}. Mantenha o restante da tela idêntico, apenas destaque ou acrescente o elemento descrito.`,
        apiKey: parametro.apiKey, modelo: parametro.modeloImagem,
      })
      imagensEditadas.push(editada)
    } catch (e) {
      req.log.error(e, 'Falha ao editar imagem via IA')
      imagensEditadas.push(null)
    }
  }

  const operador = req.operador
  const dataStr = new Date().toLocaleDateString('pt-BR')
  const docInput = {
    issue, operadorNome: operador.nome, segmentoNome, dataStr, requisitos,
    imagensAntes: imagens.map(i => ({ buffer: i.buffer })),
    imagensDepois: imagensEditadas.filter(Boolean).map(b => ({ buffer: b })),
  }

  const [docxBuffer, pdfBuffer] = await Promise.all([
    buildDocx(docInput),
    buildPdf(docInput, imageSize),
  ])

  await prisma.especificacao.deleteMany({ where: { issueId } })
  const especificacao = await prisma.especificacao.create({
    data: {
      issueId,
      contexto: contexto || null,
      requisitos,
      horasProgramacao: Number(requisitos.horasProgramacao) || 0,
      horasTeste: Number(requisitos.horasTeste) || 0,
      docx: docxBuffer,
      pdf: pdfBuffer,
      geradoPorId: operador.id,
      anexos: {
        create: imagens.map((img, i) => ({
          nomeArquivo: img.filename,
          mimeType: img.mimeType,
          dadosOriginais: img.buffer,
          dadosEditados: imagensEditadas[i] ?? null,
        })),
      },
    },
  })

  return {
    existe: true,
    horasProgramacao: especificacao.horasProgramacao,
    horasTeste: especificacao.horasTeste,
    createdAt: especificacao.createdAt,
    geradoPorNome: operador.nome,
  }
})

app.delete('/api/issues/:id/especificacao', async (req, reply) => {
  if (!requireRole(req, reply, ['ADMIN', 'EDITOR'])) return
  const issueId = Number(req.params.id)
  await prisma.especificacao.deleteMany({ where: { issueId } })
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
