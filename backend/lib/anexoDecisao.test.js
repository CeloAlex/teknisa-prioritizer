import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolverDecisoesAnexos } from './anexoDecisao.js'

test('sem nenhum mockup retornado pela IA, o padrão é MANTER', () => {
  const [d] = resolverDecisoesAnexos([], ['anexo_1'])
  assert.equal(d.tipo, 'MANTER')
  assert.equal(d.motivo, null)
  assert.equal(d.mockup, null)
})

test('IA não decidiu nada para este rótulo específico → MANTER (nunca remove por omissão)', () => {
  const mockups = [{ referenciaImagem: 'anexo_2', decisaoAnexoAnterior: { rotulo: 'anexo_2', decisao: 'REMOVER', motivo: 'obsoleta' } }]
  const [d] = resolverDecisoesAnexos(mockups, ['anexo_1'])
  assert.equal(d.tipo, 'MANTER')
})

test('decisão explícita ATUALIZAR é respeitada e o mockup correspondente é retornado', () => {
  const mockup = { referenciaImagem: 'anexo_1', tela: 'Tela X', decisaoAnexoAnterior: { rotulo: 'anexo_1', decisao: 'ATUALIZAR', motivo: 'novo campo' } }
  const [d] = resolverDecisoesAnexos([mockup], ['anexo_1'])
  assert.equal(d.tipo, 'ATUALIZAR')
  assert.equal(d.motivo, 'novo campo')
  assert.equal(d.mockup, mockup)
})

test('decisão explícita REMOVER com motivo é respeitada', () => {
  const mockups = [{ decisaoAnexoAnterior: { rotulo: 'anexo_1', decisao: 'REMOVER', motivo: 'tela removida da especificação' } }]
  const [d] = resolverDecisoesAnexos(mockups, ['anexo_1'])
  assert.equal(d.tipo, 'REMOVER')
  assert.equal(d.motivo, 'tela removida da especificação')
})

test('valor de decisão inválido/desconhecido cai para MANTER, nunca para REMOVER', () => {
  const mockups = [{ decisaoAnexoAnterior: { rotulo: 'anexo_1', decisao: 'APAGAR_TUDO', motivo: 'x' } }]
  const [d] = resolverDecisoesAnexos(mockups, ['anexo_1'])
  assert.equal(d.tipo, 'MANTER')
})

test('resolve múltiplos rótulos independentemente, cada um com sua própria decisão ou o default', () => {
  const mockups = [
    { decisaoAnexoAnterior: { rotulo: 'anexo_1', decisao: 'SUBSTITUIR', motivo: 'tela mudou muito' } },
  ]
  const resultado = resolverDecisoesAnexos(mockups, ['anexo_1', 'anexo_2', 'anexo_3'])
  assert.deepEqual(resultado.map(r => [r.rotulo, r.tipo]), [
    ['anexo_1', 'SUBSTITUIR'],
    ['anexo_2', 'MANTER'],
    ['anexo_3', 'MANTER'],
  ])
})
