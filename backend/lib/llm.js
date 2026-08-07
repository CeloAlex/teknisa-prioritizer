import OpenAI from 'openai'
import { toFile } from 'openai'

const REQUISITOS_JSON_SCHEMA = {
  name: 'especificacao',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: [
      'objetivo', 'introducao', 'requisitosFuncionais', 'regrasNegocio',
      'cenarios', 'premissasTecnicas', 'resultadoEsperado',
      'horasProgramacao', 'horasTeste',
    ],
    properties: {
      objetivo: { type: 'string', description: 'Resumo do objetivo em 1-2 frases curtas, para o cabeçalho do documento.' },
      introducao: {
        type: 'object', additionalProperties: false,
        required: ['objetivoDocumento', 'escopoContempla', 'escopoNaoContempla', 'glossario'],
        properties: {
          objetivoDocumento: { type: 'string' },
          escopoContempla: { type: 'array', items: { type: 'string' } },
          escopoNaoContempla: { type: 'array', items: { type: 'string' }, description: 'Vazio se não houver exclusões relevantes de escopo.' },
          glossario: {
            type: 'array',
            items: { type: 'object', additionalProperties: false, required: ['termo', 'definicao'], properties: { termo: { type: 'string' }, definicao: { type: 'string' } } },
          },
        },
      },
      requisitosFuncionais: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false,
          required: ['codigo', 'titulo', 'descricao', 'criteriosAceite'],
          properties: {
            codigo: { type: 'string', description: 'Ex: RF001' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            criteriosAceite: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      regrasNegocio: {
        type: 'array',
        description: 'Vazio se a issue não envolver regras de negócio explícitas.',
        items: { type: 'object', additionalProperties: false, required: ['codigo', 'texto'], properties: { codigo: { type: 'string', description: 'Ex: RN001' }, texto: { type: 'string' } } },
      },
      cenarios: {
        type: 'array',
        description: 'Vazio se não fizer sentido exemplificar com cenários de uso.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['codigo', 'titulo', 'situacao', 'resultadoEsperado'],
          properties: { codigo: { type: 'string', description: 'Ex: Cenário 01' }, titulo: { type: 'string' }, situacao: { type: 'string' }, resultadoEsperado: { type: 'string' } },
        },
      },
      premissasTecnicas: {
        type: 'array',
        description: 'Vazio se não houver premissas técnicas relevantes.',
        items: { type: 'object', additionalProperties: false, required: ['codigo', 'texto'], properties: { codigo: { type: 'string', description: 'Ex: PT001' }, texto: { type: 'string' } } },
      },
      resultadoEsperado: { type: 'string' },
      horasProgramacao: { type: 'number', description: 'Estimativa de horas de programação para um desenvolvedor júnior implementar.' },
      horasTeste: { type: 'number', description: 'Estimativa de horas de teste funcional.' },
    },
  },
}

const SYSTEM_PROMPT = `Você é um analista de negócios da Teknisa especializado em escrever documentos de especificação funcional para o sistema Teknisa HCM / Portal do Gestor.
Gere o conteúdo de um documento de especificação a partir da issue descrita pelo usuário, seguindo rigorosamente o schema JSON fornecido.
Regras importantes:
- Escreva em português, de forma objetiva e profissional, no mesmo estilo de documentos de especificação de software.
- "requisitosFuncionais" deve ter pelo menos 1 item, numerados RF001, RF002...
- "regrasNegocio", "cenarios" e "premissasTecnicas" só devem ter itens quando fizerem sentido para a complexidade da issue — para issues simples (ex: um ajuste pontual), é normal deixá-los como array vazio.
- "horasProgramacao" e "horasTeste" são estimativas realistas para um programador júnior, considerando a complexidade descrita.
- Baseie-se apenas nas informações fornecidas; não invente integrações ou sistemas externos que não foram mencionados.`

function buildUserPrompt({ issue, contexto, anexosTexto }) {
  const partes = [
    `ID da issue: ${issue.id}`,
    `Título: ${issue.nome}`,
    issue.categoria ? `Categoria: ${issue.categoria}` : null,
    issue.cliente ? `Cliente: ${issue.cliente}` : null,
    issue.produto ? `Produto: ${issue.produto}` : null,
    issue.segmento ? `Segmento: ${issue.segmento}` : null,
    issue.descricao ? `Descrição da issue:\n${issue.descricao}` : null,
    contexto ? `Informações adicionais fornecidas pelo operador:\n${contexto}` : null,
    anexosTexto ? `Conteúdo extraído de documentos anexados:\n${anexosTexto}` : null,
  ].filter(Boolean)
  return partes.join('\n\n')
}

export async function gerarRequisitos({ issue, contexto, anexosTexto, apiKey, modelo }) {
  const client = new OpenAI({ apiKey })
  const completion = await client.chat.completions.create({
    model: modelo || 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt({ issue, contexto, anexosTexto }) },
    ],
    response_format: { type: 'json_schema', json_schema: REQUISITOS_JSON_SCHEMA },
  })
  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('A IA não retornou conteúdo.')
  return JSON.parse(content)
}

export async function editarImagem({ buffer, mimeType, prompt, apiKey, modelo }) {
  const client = new OpenAI({ apiKey })
  const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png'
  const file = await toFile(buffer, `imagem.${ext}`, { type: mimeType })
  const result = await client.images.edit({
    image: file,
    model: modelo || 'gpt-image-1',
    prompt,
  })
  const b64 = result.data?.[0]?.b64_json
  if (!b64) throw new Error('A IA não retornou uma imagem editada.')
  return Buffer.from(b64, 'base64')
}
