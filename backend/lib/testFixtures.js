// Fixtures compartilhadas pelos testes determinísticos de docxGenerator/pdfGenerator.
// Não é um arquivo de teste (sem sufixo .test.js) — não é coletado pelo `node --test`.

// PNG 1x1 transparente válido, usado para exercitar o caminho de inserção de imagens.
export const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

export const ISSUE_FIXTURE = { id: 999, nome: 'Issue de teste' }

// Schema "antigo" — como registros persistidos antes da extensão do JSON de requisitos.
// Não possui tipo/cenariosAlternativos/validacoes/excecoes/pontosAValidar/telasAfetadas/mockups.
export const REQUISITOS_SCHEMA_ANTIGO = {
  objetivo: 'Ajustar a tela X para exibir o novo campo Y.',
  introducao: {
    objetivoDocumento: 'Documentar a alteração solicitada.',
    escopoContempla: ['Exibição do campo Y na tela X.'],
    escopoNaoContempla: [],
    glossario: [],
  },
  requisitosFuncionais: [
    { codigo: 'RF001', titulo: 'Exibir campo Y', descricao: 'A tela X deve exibir o campo Y.', criteriosAceite: ['Dado que a tela X é acessada, quando carregada, então o campo Y é exibido.'] },
  ],
  regrasNegocio: [],
  cenarios: [],
  premissasTecnicas: [],
  resultadoEsperado: 'O campo Y passa a ser exibido na tela X.',
  horasProgramacao: 4,
  horasTeste: 0.5,
}

// Schema estendido — todos os campos novos populados.
export const REQUISITOS_SCHEMA_NOVO = {
  ...REQUISITOS_SCHEMA_ANTIGO,
  requisitosFuncionais: [
    {
      codigo: 'RF001', titulo: 'Exibir campo Y', descricao: 'A tela X deve exibir o campo Y.',
      tipo: 'exibicao',
      criteriosAceite: ['Dado que a tela X é acessada, quando carregada, então o campo Y é exibido.'],
      cenariosAlternativos: [{ codigo: 'RF001-A', situacao: 'Campo Y sem valor', resultadoEsperado: 'Exibir "-" no lugar do valor.' }],
    },
  ],
  regrasNegocio: [{ codigo: 'RN001', texto: 'SE o campo Y não estiver preenchido ENTÃO exibir "-" SENÃO exibir o valor formatado.' }],
  validacoes: [{ codigo: 'VAL001', campo: 'Y', regra: 'Deve ser numérico e maior que zero.', mensagemErro: 'Valor inválido para o campo Y.' }],
  excecoes: [{ codigo: 'EXC001', condicao: 'Falha ao carregar o valor de Y', comportamentoEsperado: 'Exibir mensagem de erro e permitir novo carregamento.' }],
  pontosAValidar: ['Confirmar se o campo Y deve ser editável ou somente leitura.'],
  telasAfetadas: [{ nome: 'Tela X', descricaoAtual: 'Grid com colunas A, B, C; botão Filtrar no topo.' }],
  mockups: [
    { referenciaImagem: 'print1.png', tela: 'Tela X', objetivo: 'Adicionar o campo Y na grid', alteracoes: ['Adicionar coluna Y'], preservar: ['Layout geral', 'Botão Filtrar'], decisaoAnexoAnterior: null },
  ],
}
