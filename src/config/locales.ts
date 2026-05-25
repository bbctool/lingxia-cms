export const LOCALES = [
  { label: '简体中文', code: 'zh-Hans' },
  { label: '繁體中文', code: 'zh-Hant' },
  { label: 'English', code: 'en' },
  { label: '日本語', code: 'ja' },
  { label: '한국어', code: 'ko' },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

export const DEFAULT_LOCALE: LocaleCode = 'zh-Hans'

export const LOCALE_OPTIONS = LOCALES.map(({ label, code }) => ({
  label,
  value: code,
}))
