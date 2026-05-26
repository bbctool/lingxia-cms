import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { postRevalidate } from '../lib/postRevalidate'
import {
  buildArticleRevalidate,
  buildCharacterRevalidate,
  buildFaqRevalidate,
  buildPageRevalidate,
  buildSiteSettingsRevalidate,
  type RevalidatePayload,
} from '../lib/revalidateTags'

async function resolveSiteSlug(
  site: unknown,
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
): Promise<string | undefined> {
  if (!site) return undefined
  if (typeof site === 'object' && site !== null && 'slug' in site) {
    return String((site as { slug: string }).slug)
  }
  if (typeof site === 'string' || typeof site === 'number') {
    const doc = await req.payload.findByID({
      collection: 'sites',
      id: site,
      depth: 0,
    })
    return doc.slug
  }
  return undefined
}

function makeRevalidateHooks(
  build: (siteSlug: string, slug: string, doc?: Record<string, unknown>) => RevalidatePayload,
  slugField = 'slug',
) {
  const onChange: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
    if (operation !== 'create' && operation !== 'update') return

    const siteSlug = await resolveSiteSlug(doc.site, req)
    if (!siteSlug) return

    const slug = String(doc[slugField] ?? '')
    void postRevalidate(build(siteSlug, slug, doc as Record<string, unknown>))
  }

  const onDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    const siteSlug = await resolveSiteSlug(doc.site, req)
    if (!siteSlug) return

    const slug = String(doc[slugField] ?? '')
    void postRevalidate(build(siteSlug, slug, doc as Record<string, unknown>))
  }

  return { onChange, onDelete }
}

const articlesHooks = makeRevalidateHooks(buildArticleRevalidate)
export const revalidateArticles = articlesHooks.onChange
export const revalidateArticlesDelete = articlesHooks.onDelete

const pagesHooks = makeRevalidateHooks(
  (siteSlug, slug, doc) =>
    buildPageRevalidate(
      siteSlug,
      slug,
      typeof doc?.layout === 'string' ? doc.layout : undefined,
    ),
)
export const revalidatePages = pagesHooks.onChange
export const revalidatePagesDelete = pagesHooks.onDelete

const faqHooks = makeRevalidateHooks(
  (siteSlug) => buildFaqRevalidate(siteSlug),
  'id',
)
export const revalidateFaq: CollectionAfterChangeHook = async (args) => {
  await faqHooks.onChange(args)
}
export const revalidateFaqDelete: CollectionAfterDeleteHook = async (args) => {
  await faqHooks.onDelete(args)
}

const charactersHooks = makeRevalidateHooks(buildCharacterRevalidate)
export const revalidateCharacters = charactersHooks.onChange
export const revalidateCharactersDelete = charactersHooks.onDelete

const siteSettingsHooks = makeRevalidateHooks(
  (siteSlug) => buildSiteSettingsRevalidate(siteSlug),
  'id',
)
export const revalidateSiteSettings: CollectionAfterChangeHook = async (args) => {
  await siteSettingsHooks.onChange(args)
}
export const revalidateSiteSettingsDelete: CollectionAfterDeleteHook = async (
  args,
) => {
  await siteSettingsHooks.onDelete(args)
}
