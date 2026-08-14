import { test } from 'node:test'
import assert from 'node:assert/strict'
import { imageSize } from 'image-size'
import { buildPdf } from './pdfGenerator.js'
import { PNG_1X1, ISSUE_FIXTURE, REQUISITOS_SCHEMA_ANTIGO, REQUISITOS_SCHEMA_NOVO } from './testFixtures.js'

function baseInput(requisitos, imagens = {}) {
  return {
    issue: ISSUE_FIXTURE, operadorNome: 'Operador Teste', segmentoNome: 'HCM',
    dataStr: '14/08/2026', requisitos,
    imagensAntes: imagens.antes ?? [], imagensDepois: imagens.depois ?? [],
  }
}

test('gera um .pdf válido a partir do schema antigo (compatibilidade com dados já persistidos)', async () => {
  const buffer = await buildPdf(baseInput(REQUISITOS_SCHEMA_ANTIGO), imageSize)
  assert.ok(Buffer.isBuffer(buffer))
  assert.ok(buffer.length > 0)
  assert.equal(buffer.subarray(0, 4).toString('ascii'), '%PDF')
})

test('gera um .pdf válido a partir do schema novo, incluindo validações/exceções/pontos a validar', async () => {
  const buffer = await buildPdf(baseInput(REQUISITOS_SCHEMA_NOVO), imageSize)
  assert.ok(Buffer.isBuffer(buffer))
  assert.equal(buffer.subarray(0, 4).toString('ascii'), '%PDF')
})

test('gera um .pdf válido com imagens de antes/depois', async () => {
  const buffer = await buildPdf(baseInput(REQUISITOS_SCHEMA_NOVO, {
    antes: [{ buffer: PNG_1X1 }],
    depois: [{ buffer: PNG_1X1 }],
  }), imageSize)
  assert.ok(Buffer.isBuffer(buffer))
  assert.equal(buffer.subarray(0, 4).toString('ascii'), '%PDF')
})
