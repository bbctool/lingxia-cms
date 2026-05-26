import { LOCALES, type LocaleCode } from '../config/locales'

export type RevalidatePayload = {
  tags: string[]
  paths: string[]
  slug?: string
  site?: string
}

function tag(...parts: string[]) {
  return parts.filter(Boolean).join(':')
}

function forEachLocale(siteSlug: string, fn: (locale: LocaleCode) => void) {
  for (const { code } of LOCALES) {
    fn(code)
  }
}

export function buildArticleRevalidate(
  siteSlug: string,
  slug: string,
): RevalidatePayload {
  const tags: string[] = []
  const paths: string[] = []

  forEachLocale(siteSlug, (locale) => {
    tags.push(tag('articles', siteSlug, locale))
    tags.push(tag('article', siteSlug, slug, locale))
    paths.push(`/${locale}/blog`)
    paths.push(`/${locale}/blog/${slug}`)
  })

  return { tags: [...new Set(tags)], paths: [...new Set(paths)], slug, site: siteSlug }
}

export function buildPageRevalidate(
  siteSlug: string,
  slug: string,
  layout?: string | null,
): RevalidatePayload {
  const tags: string[] = []
  const paths: string[] = []
  const isCampaign = layout === 'campaign'

  forEachLocale(siteSlug, (locale) => {
    if (slug === 'home') {
      tags.push(tag('home', siteSlug, locale))
      tags.push(tag('page', siteSlug, slug, locale))
      paths.push(`/${locale}`)
    } else if (isCampaign) {
      tags.push(tag('page', siteSlug, slug, locale))
      tags.push(tag('promo-nav', siteSlug, locale))
      paths.push(`/${locale}/m/${slug}`)
      paths.push(`/${locale}`)
    } else {
      tags.push(tag('page', siteSlug, slug, locale))
      paths.push(`/${locale}/${slug}`)
    }
  })

  return { tags: [...new Set(tags)], paths: [...new Set(paths)], slug, site: siteSlug }
}

export function buildFaqRevalidate(siteSlug: string): RevalidatePayload {
  const tags: string[] = []
  const paths: string[] = []

  forEachLocale(siteSlug, (locale) => {
    tags.push(tag('faq', siteSlug, locale))
    tags.push(tag('home', siteSlug, locale))
    paths.push(`/${locale}`)
    paths.push(`/${locale}/faq`)
  })

  return { tags: [...new Set(tags)], paths: [...new Set(paths)], site: siteSlug }
}

export function buildCharacterRevalidate(
  siteSlug: string,
  slug: string,
): RevalidatePayload {
  const tags: string[] = []
  const paths: string[] = []

  forEachLocale(siteSlug, (locale) => {
    tags.push(tag('characters', siteSlug, locale))
    tags.push(tag('character', siteSlug, slug, locale))
    paths.push(`/${locale}/characters`)
    paths.push(`/${locale}/characters/${slug}`)
  })

  return { tags: [...new Set(tags)], paths: [...new Set(paths)], slug, site: siteSlug }
}

export function buildSiteSettingsRevalidate(siteSlug: string): RevalidatePayload {
  const tags: string[] = []
  const paths: string[] = []

  forEachLocale(siteSlug, (locale) => {
    tags.push(tag('site-settings', siteSlug, locale))
    tags.push(tag('home', siteSlug, locale))
    tags.push(tag('articles', siteSlug, locale))
    tags.push(tag('faq', siteSlug, locale))
    tags.push(tag('characters', siteSlug, locale))
    paths.push(`/${locale}`)
    paths.push(`/${locale}/blog`)
    paths.push(`/${locale}/faq`)
    paths.push(`/${locale}/characters`)
  })

  return { tags: [...new Set(tags)], paths: [...new Set(paths)], site: siteSlug }
}
