import {
  makeContentAccess,
  makeMediaAccess,
  makeSiteSettingsAccess,
} from './factories/contentAccess'

export const articlesAccess = makeContentAccess('articles')
export const pagesAccess = makeContentAccess('pages')
export const faqAccess = makeContentAccess('faq-items')
export const charactersAccess = makeContentAccess('characters')
export const mediaAccess = makeMediaAccess()
export const siteSettingsAccess = makeSiteSettingsAccess()
