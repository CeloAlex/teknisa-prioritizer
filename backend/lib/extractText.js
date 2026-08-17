import AdmZip from 'adm-zip'

async function extractFromDocx(buffer) {
  const zip = new AdmZip(buffer)
  const entry = zip.getEntry('word/document.xml')
  if (!entry) return ''
  const xml = entry.getData().toString('utf-8')
  const out = []
  let buf = ''
  const re = /<w:t(?:\s[^>]*)?>(.*?)<\/w:t>|<\/w:p>/gs
  let m
  while ((m = re.exec(xml))) {
    if (m[0] === '</w:p>') { if (buf.trim()) out.push(buf); buf = '' }
    else buf += m[1]
  }
  if (buf.trim()) out.push(buf)
  return out.join('\n')
}

async function extractFromPdf(buffer) {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  return result.text || ''
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

const MIME_POR_EXTENSAO_IMAGEM = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

// Extrai as imagens (prints/screenshots) coladas dentro de um .docx — muitos documentos de
// especificação/anexo são majoritariamente imagens, com pouco ou nenhum texto em <w:t>, e ficariam
// invisíveis para a IA se só o texto fosse considerado.
export async function extractImagesFromDocx(buffer, limite = 8) {
  try {
    const zip = new AdmZip(buffer)
    const entradas = zip.getEntries()
      .filter(e => e.entryName.startsWith('word/media/'))
      .sort((a, b) => a.entryName.localeCompare(b.entryName, undefined, { numeric: true }))
    const imagens = []
    for (const entrada of entradas) {
      const ext = entrada.entryName.slice(entrada.entryName.lastIndexOf('.')).toLowerCase()
      const mimeType = MIME_POR_EXTENSAO_IMAGEM[ext]
      if (!mimeType) continue // ignora .emf/.wmf/.gif e outros formatos não suportados pela IA
      imagens.push({ buffer: entrada.getData(), mimeType, nome: entrada.entryName.split('/').pop() })
      if (imagens.length >= limite) break
    }
    return imagens
  } catch {
    return []
  }
}

// Extração best-effort de texto para dar contexto extra à IA — não precisa ser perfeita.
export async function extractText(buffer, mimeType) {
  try {
    if (mimeType === 'text/plain') return buffer.toString('utf-8').slice(0, 8000)
    if (mimeType === 'application/pdf') return decodeHtmlEntities((await extractFromPdf(buffer)).slice(0, 8000))
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return decodeHtmlEntities((await extractFromDocx(buffer)).slice(0, 8000))
    }
  } catch {
    return ''
  }
  return ''
}
