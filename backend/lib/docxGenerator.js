import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ImageRun, Header, Footer, AlignmentType, BorderStyle, PageNumber,
  VerticalAlign, TabStopType, TabStopPosition,
} from 'docx'
import { imageSize } from 'image-size'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEKNISA_BLUE = '0069FF'
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: '999999' }
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER }

function fitImage(buffer, maxWidthPx = 560, maxHeightPx = 680) {
  const { width, height, type } = imageSize(buffer)
  const scale = Math.min(maxWidthPx / width, maxHeightPx / height, 1)
  const docxType = type === 'jpeg' ? 'jpg' : type
  return { width: Math.round(width * scale), height: Math.round(height * scale), type: docxType }
}

function imageParagraph(buffer, caption) {
  const { width, height, type } = fitImage(buffer)
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: caption ? 60 : 240 },
      children: [new ImageRun({ type, data: buffer, transformation: { width, height } })],
    }),
  ]
  if (caption) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: caption, italics: true, size: 18, color: '666666' })],
    }))
  }
  return children
}

function headerCell(label, value, opts = {}) {
  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    children: [new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 22 }),
        new TextRun({ text: value || '—', size: 22 }),
      ],
    })],
  })
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 320, after: 160 }, children: [new TextRun({ text })] })
}

function subheading(text) {
  return new Paragraph({
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24 })],
  })
}

function body(text) {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: text || '', size: 22 })] })
}

function bullet(text, level = 0) {
  return new Paragraph({ bullet: { level }, spacing: { after: 60 }, children: [new TextRun({ text, size: 22 })] })
}

export async function buildDocx({ issue, operadorNome, segmentoNome, dataStr, requisitos, imagensAntes = [], imagensDepois = [] }) {
  const logoBuffer = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'teknisa-logo.png'))
  const logoDim = fitImage(logoBuffer, 140, 40)

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        headerCell('Descrição', `${issue.id} - ${issue.nome}`),
        headerCell('Especificado por', `${operadorNome}${segmentoNome ? ' - ' + segmentoNome : ''}`),
      ] }),
      new TableRow({ children: [
        headerCell('Data', dataStr),
        headerCell('Objetivo', requisitos.objetivo),
      ] }),
    ],
  })

  const children = [headerTable, new Paragraph({ text: '', spacing: { after: 200 } })]

  // 1. Introdução
  children.push(heading('1. Introdução'))
  children.push(subheading('1.1 Objetivo do Documento'))
  children.push(body(requisitos.introducao?.objetivoDocumento))
  children.push(subheading('1.2 Escopo do Projeto'))
  if (requisitos.introducao?.escopoContempla?.length) {
    children.push(body('Contempla:'))
    requisitos.introducao.escopoContempla.forEach(t => children.push(bullet(t)))
  }
  if (requisitos.introducao?.escopoNaoContempla?.length) {
    children.push(body('Não Contempla:'))
    requisitos.introducao.escopoNaoContempla.forEach(t => children.push(bullet(t)))
  }
  if (requisitos.introducao?.glossario?.length) {
    children.push(subheading('1.3 Glossário'))
    requisitos.introducao.glossario.forEach(g => children.push(bullet(`${g.termo}: ${g.definicao}`)))
  }

  // 2. Requisitos Funcionais
  children.push(heading('2. Requisitos Funcionais'))
  ;(requisitos.requisitosFuncionais || []).forEach(rf => {
    children.push(subheading(`${rf.codigo} – ${rf.titulo}`))
    if (rf.descricao) children.push(body(rf.descricao))
    if (rf.criteriosAceite?.length) {
      children.push(body('Critérios de Aceite:'))
      rf.criteriosAceite.forEach(c => children.push(bullet(c)))
    }
  })

  // 3. Regras de Negócio (opcional)
  if (requisitos.regrasNegocio?.length) {
    children.push(heading('3. Regras de Negócio'))
    requisitos.regrasNegocio.forEach(rn => children.push(bullet(`${rn.codigo} – ${rn.texto}`)))
  }

  // 4. Cenários de Utilização (opcional)
  if (requisitos.cenarios?.length) {
    children.push(heading('4. Cenários de Utilização'))
    requisitos.cenarios.forEach(c => {
      children.push(subheading(c.codigo ? `${c.codigo} – ${c.titulo}` : c.titulo))
      children.push(body(`Situação: ${c.situacao}`))
      children.push(body(`Resultado Esperado: ${c.resultadoEsperado}`))
    })
  }

  // 5. Premissas Técnicas (opcional)
  if (requisitos.premissasTecnicas?.length) {
    children.push(heading('5. Premissas Técnicas'))
    requisitos.premissasTecnicas.forEach(pt => children.push(bullet(`${pt.codigo} – ${pt.texto}`)))
  }

  // 6. Resultado Esperado
  children.push(heading('6. Resultado Esperado'))
  children.push(body(requisitos.resultadoEsperado))

  // Imagens
  if (imagensAntes.length) {
    children.push(heading('Antes da implementação'))
    imagensAntes.forEach(img => children.push(...imageParagraph(img.buffer)))
  }
  if (imagensDepois.length) {
    children.push(heading('Após a implementação: (imagens meramente ilustrativas)'))
    imagensDepois.forEach(img => children.push(...imageParagraph(img.buffer)))
  }

  const doc = new Document({
    sections: [{
      properties: {},
      headers: {
        default: new Header({ children: [
          new Paragraph({
            children: [new ImageRun({ type: 'png', data: logoBuffer, transformation: { width: logoDim.width, height: logoDim.height } })],
          }),
        ] }),
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: 'TEKNISA www.teknisa.com', size: 18, color: '888888' }),
              new TextRun({ text: '\t', size: 18 }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
            ],
          }),
        ] }),
      },
      children,
    }],
    styles: {
      default: {
        document: { run: { font: 'Arial' } },
        heading1: { run: { color: TEKNISA_BLUE, size: 30, bold: true, font: 'Arial' } },
      },
    },
  })

  return Packer.toBuffer(doc)
}
