type PreviewParams = {
  collection: string
  locale: string
  slug?: string
  layout?: string
}

export function buildPreviewUrl({
  collection,
  locale,
  slug,
  layout,
}: PreviewParams): string {
  const homeUrl = (process.env.HOME_URL || 'http://localhost:3000').replace(
    /\/$/,
    '',
  )
  const secret = process.env.PREVIEW_SECRET || ''
  const params = new URLSearchParams({
    secret,
    locale,
    collection,
  })
  if (slug) {
    params.set('slug', slug)
  }
  if (layout) {
    params.set('layout', layout)
  }
  return `${homeUrl}/api/preview?${params.toString()}`
}

export function livePreviewUrl(
  collection: string,
  data: { slug?: string | null; layout?: string | null },
  locale?: { code?: string } | string | null,
): string {
  const localeCode =
    typeof locale === 'string' ? locale : locale?.code ?? 'zh-Hans'

  return buildPreviewUrl({
    collection,
    locale: localeCode,
    slug: data.slug ?? undefined,
    layout: data.layout ?? undefined,
  })
}
