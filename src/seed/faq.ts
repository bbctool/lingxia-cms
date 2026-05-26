import type { Payload } from 'payload'

import { BYPASS_PUBLISH_GUARD } from '../hooks/publishGuard'
import { postRevalidate } from '../lib/postRevalidate'
import { buildFaqRevalidate } from '../lib/revalidateTags'
import { loadFaqSeedFromMarkdown } from './lib/parse-faq-md'

const seedContext = { [BYPASS_PUBLISH_GUARD]: true }

async function deleteSiteFaqItems(payload: Payload, siteId: number): Promise<number> {
  const existing = await payload.find({
    collection: 'faq-items',
    where: { site: { equals: siteId } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  for (const doc of existing.docs) {
    await payload.delete({
      collection: 'faq-items',
      id: doc.id,
      overrideAccess: true,
    })
  }

  return existing.docs.length
}

export async function seedFaq(
  payload: Payload,
  siteId: number,
  options?: { locale?: string },
): Promise<void> {
  const locale = options?.locale ?? 'zh-Hans'
  const faqSeed = loadFaqSeedFromMarkdown()

  const removed = await deleteSiteFaqItems(payload, siteId)
  if (removed > 0) {
    console.log(`FAQ: removed ${removed} existing item(s) for site ${siteId}`)
  }

  for (const item of faqSeed) {
    await payload.create({
      collection: 'faq-items',
      data: {
        site: siteId,
        question: item.question,
        answer: item.answer,
        sort: item.sort,
        visible: true,
      },
      locale,
      context: seedContext,
      overrideAccess: true,
    })
  }

  console.log(`FAQ: seeded ${faqSeed.length} item(s) (${locale}) from FAQ.md`)

  const siteDoc = await payload.findByID({ collection: 'sites', id: siteId, depth: 0 })
  const siteSlug = typeof siteDoc.slug === 'string' ? siteDoc.slug : 'lingxia'

  const revalidated = await postRevalidate(buildFaqRevalidate(siteSlug))
  if (revalidated) {
    console.log('FAQ: home cache revalidated')
  } else {
    console.log('FAQ: skip revalidate (set REVALIDATE_URL in CMS .env)')
  }
}
