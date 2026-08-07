import PDFDocument from 'pdfkit'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEKNISA_BLUE = '#0069FF'
const GRAY = '#666666'
const MARGIN = 56
const PAGE_WIDTH = 595.28 // A4
const PAGE_HEIGHT = 841.89 // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function drawHeader(doc, logoBuffer, logoDim) {
  doc.image(logoBuffer, MARGIN, 24, { width: logoDim.width, height: logoDim.height })
  doc.x = MARGIN
  doc.y = 24 + logoDim.height + 16
}

function heading(doc, text) {
  ensureSpace(doc, 40)
  doc.moveDown(0.6)
  doc.fillColor(TEKNISA_BLUE).fontSize(15).font('Helvetica-Bold').text(text, { width: CONTENT_WIDTH })
  doc.moveDown(0.3)
  doc.fillColor('black')
}

function subheading(doc, text) {
  ensureSpace(doc, 30)
  doc.moveDown(0.4)
  doc.fillColor('black').fontSize(12).font('Helvetica-Bold').text(text, { width: CONTENT_WIDTH })
  doc.moveDown(0.15)
}

function body(doc, text) {
  if (!text) return
  doc.fillColor('black').fontSize(11).font('Helvetica').text(text, { width: CONTENT_WIDTH, align: 'justify' })
  doc.moveDown(0.4)
}

function bullet(doc, text) {
  doc.fillColor('black').fontSize(11).font('Helvetica')
    .text(`•  ${text}`, { width: CONTENT_WIDTH - 14, indent: 14 })
  doc.moveDown(0.15)
}

function ensureSpace(doc, needed) {
  if (doc.y + needed > doc.page.height - MARGIN - 30) doc.addPage()
}

export async function buildPdf({ issue, operadorNome, segmentoNome, dataStr, requisitos, imagensAntes = [], imagensDepois = [] }, imageSizeFn) {
  const logoBuffer = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'teknisa-logo.png'))
  const logoDim0 = imageSizeFn(logoBuffer)
  const logoScale = Math.min(120 / logoDim0.width, 1)
  const logoDim = { width: Math.round(logoDim0.width * logoScale), height: Math.round(logoDim0.height * logoScale) }

  const doc = new PDFDocument({ size: 'A4', margins: { top: MARGIN + logoDim.height + 20, bottom: MARGIN + 20, left: MARGIN, right: MARGIN }, bufferPages: true })
  const chunks = []
  doc.on('data', c => chunks.push(c))
  const done = new Promise(resolve => doc.on('end', resolve))

  doc.on('pageAdded', () => drawHeader(doc, logoBuffer, logoDim))
  drawHeader(doc, logoBuffer, logoDim)

  // Cabeçalho 2x2
  const colW = CONTENT_WIDTH / 2
  const rowH = 40
  const startY = doc.y
  const cell = (x, y, w, h, label, value) => {
    doc.rect(x, y, w, h).stroke('#999999')
    doc.fontSize(9).font('Helvetica-Bold').fillColor('black').text(`${label}:`, x + 6, y + 5, { width: w - 12 })
    doc.fontSize(9).font('Helvetica').text(value || '—', x + 6, y + 17, { width: w - 12, height: h - 20, ellipsis: true })
  }
  cell(MARGIN, startY, colW, rowH, 'Descrição', `${issue.id} - ${issue.nome}`)
  cell(MARGIN + colW, startY, colW, rowH, 'Especificado por', `${operadorNome}${segmentoNome ? ' - ' + segmentoNome : ''}`)
  cell(MARGIN, startY + rowH, colW, rowH, 'Data', dataStr)
  cell(MARGIN + colW, startY + rowH, colW, rowH, 'Objetivo', requisitos.objetivo)
  doc.x = MARGIN
  doc.y = startY + rowH * 2 + 16

  heading(doc, '1. Introdução')
  subheading(doc, '1.1 Objetivo do Documento')
  body(doc, requisitos.introducao?.objetivoDocumento)
  subheading(doc, '1.2 Escopo do Projeto')
  if (requisitos.introducao?.escopoContempla?.length) {
    body(doc, 'Contempla:')
    requisitos.introducao.escopoContempla.forEach(t => bullet(doc, t))
  }
  if (requisitos.introducao?.escopoNaoContempla?.length) {
    body(doc, 'Não Contempla:')
    requisitos.introducao.escopoNaoContempla.forEach(t => bullet(doc, t))
  }
  if (requisitos.introducao?.glossario?.length) {
    subheading(doc, '1.3 Glossário')
    requisitos.introducao.glossario.forEach(g => bullet(doc, `${g.termo}: ${g.definicao}`))
  }

  heading(doc, '2. Requisitos Funcionais')
  ;(requisitos.requisitosFuncionais || []).forEach(rf => {
    subheading(doc, `${rf.codigo} – ${rf.titulo}`)
    if (rf.descricao) body(doc, rf.descricao)
    if (rf.criteriosAceite?.length) {
      body(doc, 'Critérios de Aceite:')
      rf.criteriosAceite.forEach(c => bullet(doc, c))
    }
  })

  if (requisitos.regrasNegocio?.length) {
    heading(doc, '3. Regras de Negócio')
    requisitos.regrasNegocio.forEach(rn => bullet(doc, `${rn.codigo} – ${rn.texto}`))
  }

  if (requisitos.cenarios?.length) {
    heading(doc, '4. Cenários de Utilização')
    requisitos.cenarios.forEach(c => {
      subheading(doc, c.codigo ? `${c.codigo} – ${c.titulo}` : c.titulo)
      body(doc, `Situação: ${c.situacao}`)
      body(doc, `Resultado Esperado: ${c.resultadoEsperado}`)
    })
  }

  if (requisitos.premissasTecnicas?.length) {
    heading(doc, '5. Premissas Técnicas')
    requisitos.premissasTecnicas.forEach(pt => bullet(doc, `${pt.codigo} – ${pt.texto}`))
  }

  heading(doc, '6. Resultado Esperado')
  body(doc, requisitos.resultadoEsperado)

  function addImageBlock(img) {
    const dim = imageSizeFn(img.buffer)
    const scale = Math.min(CONTENT_WIDTH / dim.width, 380 / dim.height, 1)
    const w = Math.round(dim.width * scale), h = Math.round(dim.height * scale)
    ensureSpace(doc, h + 20)
    doc.image(img.buffer, MARGIN + (CONTENT_WIDTH - w) / 2, doc.y, { width: w, height: h })
    doc.y += h + 16
  }

  if (imagensAntes.length) {
    heading(doc, 'Antes da implementação')
    imagensAntes.forEach(addImageBlock)
  }
  if (imagensDepois.length) {
    heading(doc, 'Após a implementação: (imagens meramente ilustrativas)')
    imagensDepois.forEach(addImageBlock)
  }

  // Rodapé com numeração, em todas as páginas (zera a margem inferior temporariamente
  // para escrever dentro dela sem disparar quebra de página automática do pdfkit)
  const range = doc.bufferedPageRange()
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i)
    const bottomMargin = doc.page.margins.bottom
    doc.page.margins.bottom = 0
    const y = PAGE_HEIGHT - MARGIN
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
      .text('TEKNISA www.teknisa.com', MARGIN, y, { width: CONTENT_WIDTH / 2, align: 'left', lineBreak: false })
    doc.text(`Página ${i - range.start + 1} de ${range.count}`, MARGIN + CONTENT_WIDTH / 2, y, { width: CONTENT_WIDTH / 2, align: 'right', lineBreak: false })
    doc.page.margins.bottom = bottomMargin
  }

  doc.end()
  await done
  return Buffer.concat(chunks)
}
