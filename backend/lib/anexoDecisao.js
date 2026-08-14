export const DECISOES_ANEXO_VALIDAS = new Set(['MANTER', 'ATUALIZAR', 'SUBSTITUIR', 'REMOVER'])

// Resolve, para cada anexo de uma especificação anterior (por rótulo), qual decisão aplicar
// com base no que a IA retornou em requisitos.mockups[].decisaoAnexoAnterior.
// Se a IA não decidiu nada para um rótulo (ou devolveu um valor inválido), o padrão é sempre
// MANTER — uma imagem nunca é removida por omissão.
export function resolverDecisoesAnexos(mockups, rotulos) {
  const decisaoPorRotulo = new Map()
  for (const mockup of mockups ?? []) {
    const rotulo = mockup?.decisaoAnexoAnterior?.rotulo
    if (rotulo) decisaoPorRotulo.set(rotulo, { ...mockup.decisaoAnexoAnterior, mockup })
  }
  return rotulos.map(rotulo => {
    const info = decisaoPorRotulo.get(rotulo)
    const tipo = DECISOES_ANEXO_VALIDAS.has(info?.decisao) ? info.decisao : 'MANTER'
    return { rotulo, tipo, motivo: info?.motivo ?? null, mockup: info?.mockup ?? null }
  })
}
