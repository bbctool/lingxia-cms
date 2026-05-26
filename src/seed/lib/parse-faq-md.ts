import fs from 'node:fs'

import { FAQ_MD_PATH } from './faq-source-path'

export type FaqSeedItem = {
  question: string
  answer: string
  sort: number
}

function normalizeAnswer(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
}

function normalizeQuestion(raw: string): string {
  return raw.replace(/^Q\d+[：:]\s*/, '').trim()
}

/** Parse lingxia_home/docs/FAQ.md (Q1：question + answer blocks). */
export function parseFaqMarkdown(content: string): FaqSeedItem[] {
  const normalized = content.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const blocks = normalized.split(/\n(?=Q\d+[：:])/)
  const items: FaqSeedItem[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    const headerMatch = trimmed.match(/^Q(\d+)[：:]\s*(.*)$/m)
    if (!headerMatch) continue

    const order = Number(headerMatch[1])
    const questionLine = headerMatch[2]?.trim() ?? ''
    const bodyStart = trimmed.indexOf('\n')
    const answerRaw = bodyStart === -1 ? '' : trimmed.slice(bodyStart + 1)

    const question = normalizeQuestion(
      questionLine || (trimmed.match(/^Q\d+[：:]\s*(.+)$/m)?.[1] ?? ''),
    )
    const answer = normalizeAnswer(answerRaw)

    if (!question || !answer) continue

    items.push({
      question,
      answer,
      sort: Number.isFinite(order) ? order * 10 : (items.length + 1) * 10,
    })
  }

  return items
}

export function loadFaqSeedFromMarkdown(faqMdPath = FAQ_MD_PATH): FaqSeedItem[] {
  const content = fs.readFileSync(faqMdPath, 'utf8')
  const items = parseFaqMarkdown(content)

  if (items.length === 0) {
    throw new Error(`No FAQ items parsed from ${faqMdPath}`)
  }

  return items
}
