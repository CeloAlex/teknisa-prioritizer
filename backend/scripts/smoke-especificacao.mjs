// Smoke test manual do pipeline de Especificação (Camada 2 — chama a OpenAI de verdade, tem custo).
// Não roda em CI. Requer: servidor local rodando (`npm run dev` no backend) com uma chave OpenAI
// válida configurada em Parâmetros (ADMIN), e alguns arquivos de exemplo em ../../modelo (não
// versionados — já presentes localmente neste projeto).
//
// Uso:
//   node backend/scripts/smoke-especificacao.mjs [cenario]
//   BASE_URL=http://localhost:3000/api EMAIL=... SENHA=... node backend/scripts/smoke-especificacao.mjs
//
// Sem argumento, roda todos os cenários em sequência (na ordem, já que 5-8 dependem do
// resultado do cenário 3). Salva cada docx/pdf gerado em backend/scripts/output/.

import { readFile, mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const MODELO_DIR = join(REPO_ROOT, 'modelo')
const OUTPUT_DIR = join(__dirname, 'output')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api'
const EMAIL = process.env.EMAIL || 'marcelo@teknisa.com'
const SENHA = process.env.SENHA || 'Teknisa1..'
const ISSUE_ID = Number(process.env.ISSUE_ID || 900001)

let token = null

async function api(path, opts = {}) {
  const fazer = () => fetch(BASE_URL + path, {
    ...opts,
    headers: { ...(opts.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  try {
    return await fazer()
  } catch (e) {
    console.warn(`[aviso] falha de rede em ${path}, tentando novamente uma vez: ${e.message}`)
    await new Promise(r => setTimeout(r, 1000))
    return fazer()
  }
}

async function login() {
  const res = await api('/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, senha: SENHA }),
  })
  if (!res.ok) throw new Error(`Login falhou (${res.status}): ${await res.text()}`)
  const data = await res.json()
  token = data.token
  console.log(`[ok] autenticado como ${data.operador.nome} (${data.operador.papel})`)
}

async function garantirIssueDeTeste() {
  const res = await api('/issues', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: ISSUE_ID, nome: 'Issue de smoke test — pipeline de especificação', categoria: 'Erro - prioridade alta',
      cliente: 'Cliente de Teste', produto: 'Teknisa HCM', status: 'Especificação',
      descricao: 'Adicionar o campo "Chave PIX" na grade de dados bancários do colaborador, incluindo validação de formato e exibição no relatório de admissão.',
    }),
  })
  if (!res.ok) throw new Error(`Falha ao criar/atualizar issue de teste (${res.status}): ${await res.text()}`)
  console.log(`[ok] issue de teste #${ISSUE_ID} pronta`)
}

const MIME_POR_EXTENSAO = {
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

async function arquivoDeApoio(nome) {
  const caminho = join(MODELO_DIR, nome)
  if (!existsSync(caminho)) {
    console.warn(`[aviso] arquivo de apoio não encontrado, pulando anexo: ${caminho}`)
    return null
  }
  const ext = nome.slice(nome.lastIndexOf('.')).toLowerCase()
  const mimeType = MIME_POR_EXTENSAO[ext]
  if (!mimeType) {
    console.warn(`[aviso] extensão sem mimetype mapeado (${ext}), pulando anexo: ${nome}`)
    return null
  }
  const buffer = await readFile(caminho)
  return { buffer, nome, mimeType }
}

async function gerar(cenario, { contexto = '', arquivos = [] } = {}) {
  const fd = new FormData()
  fd.append('contexto', contexto)
  for (const a of arquivos) {
    fd.append('arquivos', new Blob([a.buffer], { type: a.mimeType }), a.nome)
  }
  const inicio = Date.now()
  const res = await api(`/issues/${ISSUE_ID}/especificacao/gerar`, { method: 'POST', body: fd })
  const duracaoS = ((Date.now() - inicio) / 1000).toFixed(1)
  const data = await res.json()
  if (!res.ok) {
    console.error(`[FALHOU] cenário "${cenario}" (${duracaoS}s): ${data.error}`)
    return null
  }
  console.log(`[ok] cenário "${cenario}" (${duracaoS}s) — ${data.horasProgramacao}h prog / ${data.horasTeste}h teste`)
  if (data.mockupsResumo?.length) {
    console.log('       mockups:', data.mockupsResumo.map(m => `${m.tela}:${m.status}`).join(', '))
  }
  if (data.avisos?.length) {
    console.log('       avisos:', data.avisos.join(' | '))
  }
  await salvarDocumentos(cenario)
  return data
}

async function salvarDocumentos(cenario) {
  await mkdir(OUTPUT_DIR, { recursive: true })
  const slug = cenario.toLowerCase().replace(/[^a-z0-9]+/g, '_')
  for (const formato of ['docx', 'pdf']) {
    const res = await api(`/issues/${ISSUE_ID}/especificacao/arquivo?formato=${formato}`)
    if (!res.ok) continue
    const buffer = Buffer.from(await res.arrayBuffer())
    await writeFile(join(OUTPUT_DIR, `${slug}.${formato}`), buffer)
  }
}

const CENARIOS = {
  async '1_so_texto'() {
    await gerar('1_so_texto', { contexto: 'Adicionar o campo "Chave PIX" na grade de dados bancários do colaborador.' })
  },
  async '2_texto_docx'() {
    const doc = await arquivoDeApoio('625759 - ERRO RELATÓRIO Resumo dos Totais da Folha de Pagamento.docx')
    await gerar('2_texto_docx', { contexto: 'Considere o documento anexado como referência do problema relatado pelo cliente.', arquivos: doc ? [doc] : [] })
  },
  async '3_texto_print'() {
    const print = await arquivoDeApoio('Ocorrencias.jpg')
    await gerar('3_texto_print', { contexto: 'Adicionar filtro por período nesta tela de ocorrências.', arquivos: print ? [{ ...print, nome: 'tela_ocorrencias.jpg' }] : [] })
  },
  async '4_texto_multiplos_prints'() {
    const print = await arquivoDeApoio('Ocorrencias.jpg')
    if (!print) return
    await gerar('4_texto_multiplos_prints', {
      contexto: 'As duas telas anexadas fazem parte do mesmo fluxo; padronize o filtro de período em ambas.',
      arquivos: [{ ...print, nome: 'tela_ocorrencias_1.jpg' }, { ...print, nome: 'tela_ocorrencias_2.jpg' }],
    })
  },
  // 5-8 dependem do cenário 3 já ter rodado antes (reespecificação sobre a mesma issue).
  async '5_reespec_preservando_imagens'() {
    await gerar('5_reespec_preservando_imagens', { contexto: 'Apenas reforce, no texto do requisito, que o filtro de período é obrigatório.' })
  },
  async '6_reespec_alterando_mockup'() {
    await gerar('6_reespec_alterando_mockup', { contexto: 'Na tela de ocorrências, o filtro de período deve ficar no topo da tela, ao lado do botão Filtrar, não mais dentro do formulário lateral.' })
  },
  async '7_reespec_removendo_mockup'() {
    await gerar('7_reespec_removendo_mockup', { contexto: 'A alteração na tela de ocorrências foi cancelada; remova essa tela da especificação, ela não se aplica mais.' })
  },
  async '8_reespec_substituindo_print'() {
    const print = await arquivoDeApoio('Ocorrencias.jpg')
    await gerar('8_reespec_substituindo_print', {
      contexto: 'Considere esta nova versão da tela como referência, substituindo qualquer tela anterior.',
      arquivos: print ? [{ ...print, nome: 'tela_ocorrencias_nova.jpg' }] : [],
    })
  },
}

async function main() {
  const alvo = process.argv[2]
  await login()
  await garantirIssueDeTeste()

  const nomes = alvo ? [alvo] : Object.keys(CENARIOS)
  for (const nome of nomes) {
    const fn = CENARIOS[nome]
    if (!fn) { console.error(`Cenário desconhecido: ${nome}. Disponíveis: ${Object.keys(CENARIOS).join(', ')}`); process.exitCode = 1; continue }
    await fn()
  }

  console.log(`\nDocumentos salvos em ${OUTPUT_DIR}`)
  console.log('Cenário 9 (documento-modelo respeitado) é validação manual: abra os .docx gerados e compare cabeçalho/seções/rodapé com uma especificação gerada antes desta mudança.')
}

main().catch(e => { console.error(e); process.exitCode = 1 })
