import type { Access } from 'payload'

/** @deprecated Use collection-specific access from `@/access` */
export const isAdminUser: Access = ({ req }) => Boolean(req.user)

/** Public read for published articles only. */
export const publicReadArticles: Access = ({ req }) => {
  if (req.user) return true
  return {
    status: { equals: 'published' },
    publishedAt: { less_than_equal: new Date().toISOString() },
  }
}

/** Public read for published pages only. */
export const publicReadPages: Access = ({ req }) => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}

/** Public read for visible FAQ items only. */
export const publicReadFaq: Access = ({ req }) => {
  if (req.user) return true
  return { visible: { equals: true } }
}

/** Public read for visible characters only. */
export const publicReadCharacters: Access = ({ req }) => {
  if (req.user) return true
  return { visible: { equals: true } }
}

/** Site settings are public read (SEO / footer copy). */
export const publicReadSiteSettings: Access = ({ req }) => {
  if (req.user) return true
  return true
}
