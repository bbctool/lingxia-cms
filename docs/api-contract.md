# lingxia-cms API Contract (v3)

> 架构总览见 [cms-multichannel-architecture.md](../../docs/cms-multichannel-architecture.md)。

Base URL: `PAYLOAD_PUBLIC_URL` (e.g. `http://localhost:3001`)

## Locale（必 read）

**所有内容 API 必须带 `locale`**（BCP 47），与 `lingxia_home` 路由 `/{locale}/...` 一致。

| code | 语言 |
|------|------|
| `zh-Hans` | 简体中文（默认） |
| `zh-Hant` | 繁体中文 |
| `en` | English |
| `ja` | 日本語 |
| `ko` | 한국어 |

**传递方式（二选一，SDK 统一封装）：**

```http
GET /api/articles?locale=zh-Hant&...
```

或：

```http
Accept-Language: zh-Hant
```

**Slug 策略 A：** `slug` 不随语言变化；同一文章各语言共用 `welcome-to-lingxia`，URL 为 `/zh-Hant/blog/welcome-to-lingxia`。

**Home env（须与 CMS `sites.enabledLocales` 一致）：**

```bash
CONTENT_SITE_SLUG=lingxia
CONTENT_DEFAULT_LOCALE=zh-Hans
CONTENT_LOCALES=zh-Hans,zh-Hant,en,ja,ko
```

## Site scope

All queries filter by site:

```http
where[site.slug][equals]=lingxia
```

## Articles（replaces `posts` in target architecture）

### List published

```http
GET /api/articles?locale={locale}&where[site.slug][equals]=lingxia&where[status][equals]=published&sort=-publishedAt&depth=2&limit=100
```

Only include slugs in `localesPublished` for sitemap (home-side filter).

### Get by slug

```http
GET /api/articles?locale={locale}&where[slug][equals]={slug}&where[site.slug][equals]=lingxia&depth=2&limit=1
```

### Field mapping → home

| Payload | Home |
|---------|------|
| `slug` | `slug` (not localized) |
| `title` | `title` (current locale) |
| `excerpt` | `description` |
| `body` | Lexical JSON → `RichText` |
| `cover.url` | `cover` |
| `seo` | `buildMetadata` |
| `localesPublished` | sitemap / hreflang |

## Pages

```http
GET /api/pages?locale={locale}&where[slug][equals]=about&where[site.slug][equals]=lingxia&depth=2
GET /api/pages?locale={locale}&where[slug][equals]=home&where[layout][equals]=landing&where[status][equals]=published&depth=0
```

| Payload (`layout=landing`, slug=`home`) | Home |
|----------------------------------------|------|
| `hero.headline`, `hero.tagline` | SiteHeader h1 + tagline |
| `heroSocial.dividerText` | HeroCenterActions divider |
| `chapterOne.*` | ChaptersSection chapter 01 |
| `chapterTwo.cards[]` | ChaptersSection chapter 02 cards + dialogues |
| `ctaSection.*` | ChaptersSection bottom CTA |
| `seo` | home `generateMetadata` (optional) |
| `localesPublished` | hreflang |

Block-based pages (`layout≠landing`) still use `body` blocks as before.

## FAQ

```http
GET /api/faq-items?locale={locale}&where[site.slug][equals]=lingxia&where[visible][equals]=true&sort=sort
```

| Payload | Home |
|---------|------|
| `question` | FAQ title (localized) |
| `answer` | FAQ body (localized) |
| `sort` | display order |

## Characters

```http
GET /api/characters?locale={locale}&where[site.slug][equals]=lingxia&where[visible][equals]=true&sort=sort&depth=1
```

```http
GET /api/characters?locale={locale}&where[slug][equals]=char-1&where[site.slug][equals]=lingxia&depth=1&limit=1
```

| Payload | Home |
|---------|------|
| `slug` | `id` / route param (not localized) |
| `name`, `title`, `tagline`, `description`, `system`, `traits` | localized |
| `avatarPath` / `imagePath` / `bgPath` | static asset paths when no upload |
| `avatar`, `image` | media URLs when uploaded |

## Site settings

```http
GET /api/site-settings?locale={locale}&where[site.slug][equals]=lingxia&depth=1&limit=1
```

| Payload | Home |
|---------|------|
| `brandName` | SiteHeader logo text |
| `pageLabels.blog/faq/characters` | list page title + description + metadata |
| `defaultSeo` | `buildMetadata` defaults |
| `homeSeoParagraph` | noscript / GEO fallback |
| `footerCopy` | Lexical → footer (PR-4) |
| `socialLinks[]` (`platform`, `label`, `url`) | HeroCenterActions icons + aria-label |

## Authentication

```http
Authorization: users API-Key <key>
```

## Revalidate webhook

CMS `afterChange` hooks POST to home when `REVALIDATE_URL` is set. Tags match home `fetchCms` cache tags (with locale).

```http
POST /api/revalidate
x-revalidate-secret: {REVALIDATE_SECRET}
Content-Type: application/json

{
  "tags": [
    "articles:lingxia:zh-Hans",
    "article:lingxia:menu:zh-Hans"
  ],
  "paths": ["/zh-Hans/blog", "/zh-Hans/blog/menu"]
}
```

| Collection save | Example tags (per locale) |
|-----------------|---------------------------|
| articles | `articles:{site}:{locale}`, `article:{site}:{slug}:{locale}` |
| pages home | `home:{site}:{locale}`, `page:{site}:home:{locale}` |
| pages other | `page:{site}:{slug}:{locale}` |
| faq-items | `faq:{site}:{locale}` |
| characters | `characters:{site}:{locale}`, `character:{site}:{slug}:{locale}` |
| site-settings | `site-settings`, `home`, `articles`, `faq`, `characters` list tags |

## Preview

Requires home `PREVIEW_SECRET` (same as CMS), `CONTENT_API_KEY` ( **`home-preview@lingxia.local`** machine user from CMS seed — not platform-admin), and CMS Admin **Live Preview** or manual URL:

```http
GET http://localhost:3000/api/preview?secret={PREVIEW_SECRET}&locale=zh-Hans&slug=menu&collection=articles
```

Exit preview:

```http
GET http://localhost:3000/api/preview/disable?locale=zh-Hans
```

## Admin RBAC v2 (PR-G5)

Public REST reads are unchanged (published / visible filters). **Admin write** checks permission slugs (e.g. `articles.update`, `articles.publish`); site scope via `users.sites[]` unless role has `allSites`.

| System role | Admin API write |
|-------------|-----------------|
| `platform-admin` | all permissions, all sites |
| `site-admin` | content + publish + site-settings on assigned sites |
| `editor` | content CRUD + publish + media on assigned sites |
| `contributor` | create/update drafts only (no publish/delete) |
| `viewer` | read only |

Machine users (e.g. home preview) should use `viewer` + scoped sites — not `platform-admin`. See [cms-rbac-governance.md](../../docs/cms-rbac-governance.md).

## API Key (PR-G3)

| Key | User | Role | Write |
|-----|------|------|-------|
| `CONTENT_API_KEY` (home) | `home-preview@lingxia.local` | `viewer` | **No** |
| Admin personal key | any | any | **No** (API Key auth is read-only) |

- Header: `Authorization: users API-Key {key}`
- Authenticated read includes drafts within `users.sites[]` (for preview / `draft=true`)
- `POST` / `PATCH` / `DELETE` via API Key always return forbidden

Generate via `npm run seed:push` (logs key once) or set `HOME_PREVIEW_API_KEY` in CMS `.env` before seed.

## Audit logs (PR-G4)

| Collection | Access | Notes |
|------------|--------|-------|
| `audit-logs` | platform-admin read | Append-only via hooks; no body diff |

Fields: `user`, `action` (create/update/delete/publish), `collection`, `docId`, `slug`, `site`, `at`.

Articles also have `author` (immutable after create). Admin list: **Mine only** filter.

## Legacy: Posts

**Removed in PR-1.** Use `/api/articles` only.

## Phase 2+ checklist

See architecture doc §17–20.
