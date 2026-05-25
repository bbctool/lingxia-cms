import type { LocaleCode } from './locales'

/**
 * Fallback rules aligned with cms-multichannel-architecture.md §5.5.
 * Payload localization.fallback handles zh-Hant → zh-Hans when enabled globally.
 * en / ja / ko must not cross-fallback to Chinese in public web rendering (home enforces via localesPublished).
 */
export const localePolicies: Record<
  LocaleCode,
  { fallback?: LocaleCode[]; noCrossFallback?: boolean }
> = {
  'zh-Hans': {},
  'zh-Hant': { fallback: ['zh-Hans'] },
  en: { noCrossFallback: true },
  ja: { noCrossFallback: true },
  ko: { noCrossFallback: true },
}
