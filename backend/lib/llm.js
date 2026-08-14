import OpenAI from 'openai'
import { toFile } from 'openai'

const DECISOES_ANEXO = ['MANTER', 'ATUALIZAR', 'SUBSTITUIR', 'REMOVER']

const REQUISITOS_JSON_SCHEMA = {
  name: 'especificacao',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: [
      'objetivo', 'introducao', 'requisitosFuncionais', 'regrasNegocio',
      'cenarios', 'validacoes', 'excecoes', 'premissasTecnicas', 'pontosAValidar',
      'telasAfetadas', 'mockups', 'resultadoEsperado',
      'horasProgramacao', 'horasTeste',
    ],
    properties: {
      objetivo: { type: 'string', description: 'Descrição completa do objetivo da issue, para o cabeçalho do documento. Não usar reticências (...) nem truncar o texto.' },
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
          required: ['codigo', 'titulo', 'descricao', 'tipo', 'criteriosAceite', 'cenariosAlternativos'],
          properties: {
            codigo: { type: 'string', description: 'Ex: RF001' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            tipo: {
              type: 'string',
              enum: ['inclusao', 'alteracao', 'exclusao', 'validacao', 'exibicao', 'permissao', 'auditoria', 'integracao', 'outro'],
              description: 'Natureza do comportamento descrito — use para não misturar comportamentos distintos num único requisito.',
            },
            criteriosAceite: {
              type: 'array', items: { type: 'string' },
              description: 'Critérios objetivos e testáveis (formato Dado/Quando/Então quando fizer sentido), nunca genéricos como "deve funcionar corretamente".',
            },
            cenariosAlternativos: {
              type: 'array',
              description: 'Exceções, validações e caminhos alternativos específicos deste requisito. Vazio se não houver nenhum relevante.',
              items: {
                type: 'object', additionalProperties: false,
                required: ['codigo', 'situacao', 'resultadoEsperado'],
                properties: { codigo: { type: 'string' }, situacao: { type: 'string' }, resultadoEsperado: { type: 'string' } },
              },
            },
          },
        },
      },
      regrasNegocio: {
        type: 'array',
        description: 'Vazio se a issue não envolver regras de negócio explícitas ou implícitas. Escreva regras testáveis, preferencialmente no formato SE [condição] ENTÃO [comportamento] SENÃO [alternativa].',
        items: { type: 'object', additionalProperties: false, required: ['codigo', 'texto'], properties: { codigo: { type: 'string', description: 'Ex: RN001' }, texto: { type: 'string' } } },
      },
      cenarios: {
        type: 'array',
        description: 'Cenários de uso gerais (não ligados a um requisito específico). Vazio se não fizer sentido exemplificar.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['codigo', 'titulo', 'situacao', 'resultadoEsperado'],
          properties: { codigo: { type: 'string', description: 'Ex: Cenário 01' }, titulo: { type: 'string' }, situacao: { type: 'string' }, resultadoEsperado: { type: 'string' } },
        },
      },
      validacoes: {
        type: 'array',
        description: 'Regras de validação de campo/entrada aplicáveis à demanda. Vazio se não houver validações relevantes.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['codigo', 'campo', 'regra', 'mensagemErro'],
          properties: { codigo: { type: 'string', description: 'Ex: VAL001' }, campo: { type: 'string' }, regra: { type: 'string' }, mensagemErro: { type: 'string' } },
        },
      },
      excecoes: {
        type: 'array',
        description: 'Tratamento de erros/exceções (ex: falha de integração, ausência de registros, reprocessamento). Vazio se não se aplicar.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['codigo', 'condicao', 'comportamentoEsperado'],
          properties: { codigo: { type: 'string', description: 'Ex: EXC001' }, condicao: { type: 'string' }, comportamentoEsperado: { type: 'string' } },
        },
      },
      premissasTecnicas: {
        type: 'array',
        description: 'Afirmações assumidas como verdadeiras para a implementação. Vazio se não houver premissas técnicas relevantes.',
        items: { type: 'object', additionalProperties: false, required: ['codigo', 'texto'], properties: { codigo: { type: 'string', description: 'Ex: PT001' }, texto: { type: 'string' } } },
      },
      pontosAValidar: {
        type: 'array', items: { type: 'string' },
        description: 'Perguntas/lacunas em aberto que precisam ser confirmadas com o solicitante antes ou durante a implementação. Vazio se a demanda estiver totalmente clara.',
      },
      telasAfetadas: {
        type: 'array',
        description: 'Uma entrada por imagem/tela de referência analisada (novas ou de uma especificação anterior), descrevendo o que foi observado nela. Vazio se nenhuma imagem foi fornecida.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['nome', 'descricaoAtual'],
          properties: {
            nome: { type: 'string', description: 'Nome/identificação da tela.' },
            descricaoAtual: { type: 'string', description: 'Título, campos, labels, grids, colunas, filtros, botões, abas, menus e demais elementos observados na imagem.' },
          },
        },
      },
      mockups: {
        type: 'array',
        description: 'Um item por imagem que deve compor o documento final (novas telas editadas e/ou anexos anteriores reaproveitados). Vazio se não houver nenhuma imagem envolvida.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['referenciaImagem', 'tela', 'objetivo', 'alteracoes', 'preservar', 'decisaoAnexoAnterior'],
          properties: {
            referenciaImagem: { type: 'string', description: 'Nome do arquivo novo OU rótulo (ex: anexo_1) do anexo anterior a que este mockup se refere.' },
            tela: { type: 'string' },
            objetivo: { type: 'string', description: 'O que esta imagem específica deve demonstrar.' },
            alteracoes: { type: 'array', items: { type: 'string' }, description: 'Alterações pontuais a aplicar nesta tela.' },
            preservar: { type: 'array', items: { type: 'string' }, description: 'Elementos que devem permanecer idênticos nesta tela.' },
            decisaoAnexoAnterior: {
              type: ['object', 'null'],
              description: 'Preenchido apenas quando referenciaImagem corresponde a um anexo de uma especificação anterior (reespecificação); null para imagens novas.',
              additionalProperties: false,
              required: ['rotulo', 'decisao', 'motivo'],
              properties: {
                rotulo: { type: 'string' },
                decisao: { type: 'string', enum: DECISOES_ANEXO, description: 'MANTER: reaproveitar sem editar. ATUALIZAR: pequenos ajustes. SUBSTITUIR: refazer a partir do original. REMOVER: só se a tela ficou obsoleta ou foi pedido explicitamente — nunca por omissão.' },
                motivo: { type: 'string' },
              },
            },
          },
        },
      },
      resultadoEsperado: { type: 'string' },
      horasProgramacao: { type: 'number', description: 'Estimativa de horas de programação para um desenvolvedor júnior implementar.' },
      horasTeste: { type: 'number', description: 'Estimativa de horas de teste funcional. Deve ser no máximo 20% do valor de horasProgramacao.' },
    },
  },
}

const SYSTEM_PROMPT = `Você é um Senior Requirements Engineer + Product Analyst + UX Analyst da Teknisa, especializado em especificação funcional para o sistema Teknisa HCM / Portal do Gestor.

Seu papel NÃO é resumir a demanda recebida. É compreendê-la, decompor o problema, analisar todas as evidências fornecidas (texto, documentos anexados e imagens de tela) e produzir uma engenharia de requisitos completa, seguindo rigorosamente o schema JSON fornecido.

Como analisar as entradas:
- Trate a descrição da issue, o contexto adicional, os documentos anexados e as imagens como fontes de mesmo peso — nenhuma é "meramente secundária".
- Imagens de telas são uma fonte primária de requisitos. Para cada imagem fornecida, identifique título da tela, campos, labels, grids, colunas, filtros, botões, abas, menus, agrupamentos, checkboxes, seletores, mensagens, ações e hierarquia visual, e registre isso em "telasAfetadas". Use esses elementos para inferir requisitos que o texto sozinho não deixaria claros (ex: onde um campo novo deve aparecer, quais colunas uma grid já tem).
- Não invente informações que não possam ser inferidas das entradas. Quando houver lacuna relevante, registre em "pontosAValidar" (pergunta em aberto) ou como um item de "premissasTecnicas" (afirmação assumida).

Como fazer engenharia de requisitos:
- Decomponha comportamentos distintos em requisitos separados (inclusão, alteração, exclusão, consulta, validação, exibição, permissão, auditoria são requisitos DIFERENTES), mas não fragmente artificialmente um único comportamento só para aumentar a contagem.
- Explore, quando pertinente à demanda: ausência de informação, informação inválida, duplicidade, usuário sem permissão, parametrização habilitada/desabilitada, dependência entre parâmetros, processamento parcial, falha de integração, ausência de registros, reprocessamento, reflexos em outras telas/processos. Só inclua o que for realmente pertinente — não crie cenários fictícios.
- Regras de negócio devem ser testáveis, preferencialmente no formato "SE [condição] ENTÃO [comportamento] SENÃO [alternativa]".
- Critérios de aceite devem ser objetivos o bastante para QA criar casos de teste sem precisar voltar a perguntar nada — evite frases como "deverá funcionar corretamente"; prefira o formato Dado/Quando/Então.
- A quantidade de requisitos, regras, validações e exceções deve ser consequência da complexidade real da demanda — uma issue simples gera poucos itens, uma complexa gera muitos. Nunca infle artificialmente nem limite artificialmente.

Como tratar anexos de uma especificação ANTERIOR (reespecificação), quando fornecidos:
- Você receberá o contexto e as imagens da especificação anterior rotulados (anexo_1, anexo_2...). Decida para cada um, em "mockups[].decisaoAnexoAnterior": MANTER (nada muda), ATUALIZAR (ajuste pontual), SUBSTITUIR (refazer do zero a partir da tela original) ou REMOVER (só se a tela ficou obsoleta pela nova especificação ou foi pedido explicitamente — nunca remova por omissão ou dúvida; na dúvida, MANTER).
- A nova especificação deve incorporar o que já existia, não recomeçar do zero — trate o contexto anterior como parte do entendimento acumulado da demanda.

Sobre os mockups da solução futura:
- Priorize fidelidade à tela de referência: a intenção é TELA ATUAL + ALTERAÇÕES = TELA FUTURA, uma edição conservadora, não uma reinterpretação livre da interface.
- Para cada imagem que deve compor o documento (nova ou reaproveitada), preencha um item em "mockups" com "alteracoes" (o que muda) e "preservar" (o que deve continuar idêntico) específicos daquela tela — isso guiará a edição da imagem, não escreva instruções genéricas que sirvam para qualquer tela.

Regras gerais:
- Escreva em português, de forma objetiva e profissional, no mesmo estilo de documentos de especificação de software.
- "requisitosFuncionais" deve ter pelo menos 1 item, numerados RF001, RF002...
- "regrasNegocio", "cenarios", "validacoes", "excecoes", "pontosAValidar" e "telasAfetadas"/"mockups" só devem ter itens quando fizerem sentido — para issues simples é normal deixá-los vazios.
- "horasProgramacao" e "horasTeste" são estimativas realistas para um programador júnior; "horasTeste" nunca deve ultrapassar 20% de "horasProgramacao".
- Baseie-se apenas nas informações fornecidas; não invente integrações ou sistemas externos que não foram mencionados.
- "objetivo" (cabeçalho do documento) deve trazer uma descrição completa do objetivo da issue, sem reticências (...) e sem truncar o texto.
- As "Informações adicionais fornecidas pelo operador" e o "Conteúdo extraído de documentos anexados" são apenas direcionamento de contexto: use-os para entender melhor a issue, mas NÃO copie, cite ou reproduza esse texto literalmente em nenhum campo do documento gerado. O documento final deve conter apenas a especificação redigida por você, de forma própria e completa — nunca transcrevendo as entradas.`

const REVISOR_SYSTEM_PROMPT = `Você é um revisor sênior de Engenharia de Requisitos / QA da Teknisa. Sua tarefa é criticar um rascunho de especificação (JSON) e devolver a versão FINAL corrigida e completa, seguindo o mesmo schema.

Checklist a aplicar antes de responder:
- Todos os pedidos da demanda (texto-fonte) foram contemplados no rascunho?
- Existem requisitos implícitos importantes, visíveis no texto-fonte ou nas telas descritas em "telasAfetadas", que ficaram de fora?
- Existem regras de negócio, validações ou exceções mencionadas ou implícitas no texto-fonte que não foram documentadas?
- Existem ambiguidades ou contradições entre requisitos?
- Os critérios de aceite são objetivos e testáveis (nunca genéricos como "deve funcionar corretamente")?
- A granularidade está correta: nenhum requisito mistura comportamentos distintos (ex: inclusão + validação + auditoria no mesmo item), e nenhum requisito foi fragmentado artificialmente?
- Desenvolvimento conseguiria implementar, e QA conseguiria criar casos de teste, só com este documento, sem precisar voltar ao analista para esclarecer algo óbvio?
- Se há anexos de uma especificação anterior: cada "decisaoAnexoAnterior" é coerente com a nova solicitação, e nenhuma decisão de REMOVER foi tomada sem justificativa explícita (na dúvida, deveria ser MANTER)?

Corrija o JSON diretamente — não descreva os problemas encontrados, apenas devolva o JSON final já corrigido e completo, respeitando o mesmo schema e todas as regras de granularidade, testabilidade e fidelidade das entradas descritas para a etapa de redação.`

function buildTextPrompt({ issue, contexto, anexosTexto, contextoAnterior }) {
  const partes = [
    `ID da issue: ${issue.id}`,
    `Título: ${issue.nome}`,
    issue.categoria ? `Categoria: ${issue.categoria}` : null,
    issue.cliente ? `Cliente: ${issue.cliente}` : null,
    issue.produto ? `Produto: ${issue.produto}` : null,
    issue.segmento ? `Segmento: ${issue.segmento}` : null,
    issue.descricao ? `Descrição da issue:\n${issue.descricao}` : null,
    contextoAnterior ? `Esta é uma REESPECIFICAÇÃO. Contexto/objetivo já definidos em uma especificação anterior desta mesma issue (entenda como parte do acumulado, não copie literalmente):\n${contextoAnterior}` : null,
    contexto ? `Informações adicionais fornecidas pelo operador nesta rodada:\n${contexto}` : null,
    anexosTexto ? `Conteúdo extraído de documentos anexados:\n${anexosTexto}` : null,
  ].filter(Boolean)
  return partes.join('\n\n')
}

function imagePart(buffer, mimeType) {
  return {
    type: 'image_url',
    image_url: { url: `data:${mimeType};base64,${buffer.toString('base64')}`, detail: 'high' },
  }
}

function buildUserContent({ issue, contexto, anexosTexto, imagens = [], anexosAnteriores = [], contextoAnterior }) {
  const content = [{ type: 'text', text: buildTextPrompt({ issue, contexto, anexosTexto, contextoAnterior }) }]
  for (const a of anexosAnteriores) {
    content.push({ type: 'text', text: `Anexo de uma especificação anterior desta issue — rótulo "${a.rotulo}" (arquivo: ${a.filename}). Decida o que fazer com esta tela em "mockups[].decisaoAnexoAnterior":` })
    content.push(imagePart(a.buffer, a.mimeType))
  }
  for (const img of imagens) {
    content.push({ type: 'text', text: `Novo anexo enviado pelo operador nesta rodada (arquivo: ${img.filename}):` })
    content.push(imagePart(img.buffer, img.mimeType))
  }
  return content
}

function clampHorasTeste(resultado) {
  const limiteHorasTeste = resultado.horasProgramacao * 0.2
  if (resultado.horasTeste > limiteHorasTeste) {
    resultado.horasTeste = Math.round(limiteHorasTeste * 10) / 10
  }
  return resultado
}

export async function gerarRequisitos({ issue, contexto, anexosTexto, imagens, anexosAnteriores, contextoAnterior, apiKey, modelo }) {
  const client = new OpenAI({ apiKey })
  const completion = await client.chat.completions.create({
    model: modelo || 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserContent({ issue, contexto, anexosTexto, imagens, anexosAnteriores, contextoAnterior }) },
    ],
    response_format: { type: 'json_schema', json_schema: REQUISITOS_JSON_SCHEMA },
  })
  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('A IA não retornou conteúdo.')
  return clampHorasTeste(JSON.parse(content))
}

export async function revisarRequisitos({ requisitosDraft, issue, contexto, anexosTexto, contextoAnterior, apiKey, modelo }) {
  const client = new OpenAI({ apiKey })
  const textoFonte = buildTextPrompt({ issue, contexto, anexosTexto, contextoAnterior })
  const completion = await client.chat.completions.create({
    model: modelo || 'gpt-4o',
    messages: [
      { role: 'system', content: REVISOR_SYSTEM_PROMPT },
      { role: 'user', content: `Texto-fonte da demanda:\n\n${textoFonte}\n\n---\n\nRascunho da especificação a revisar (JSON):\n\n${JSON.stringify(requisitosDraft)}` },
    ],
    response_format: { type: 'json_schema', json_schema: REQUISITOS_JSON_SCHEMA },
  })
  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('A IA não retornou conteúdo na revisão.')
  return clampHorasTeste(JSON.parse(content))
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
