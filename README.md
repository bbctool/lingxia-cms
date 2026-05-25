# lingxia-cms

灵虾官网内容服务（Payload 3 + PostgreSQL）。供 [`lingxia_home`](../lingxia_home) 通过 REST 读取多语言内容。

- Admin: http://localhost:3001/admin
- API: http://localhost:3001/api/articles

## Prerequisites

- Node.js 20+
- Docker（推荐，含 PostgreSQL）

## Quick start (Docker)

```bash
cp .env.example .env
# Edit PAYLOAD_SECRET (min 32 chars)

docker compose up --build
```

Open http://localhost:3001/admin and create the first admin user.

## Local development

```bash
cp .env.example .env
# PostgreSQL on port 5432 matching DATABASE_URI

npm install
npm run payload migrate          # apply existing migrations
npm run seed:push                # push PR-3 schema + seed (see below)
npm run dev
```

### PR-3 schema upgrade (existing DB)

`migrate:create` is interactive on `faq_items` (site + localization). For local dev:

```bash
# If you have legacy faq_items without site_id:
psql "$DATABASE_URI" -c "DROP TABLE IF EXISTS faq_items CASCADE;"

npm run seed:push
```

Production: run `npm run payload migrate:create` and choose **create column** for each prompt, then `npm run payload migrate` and `npm run seed`.

## Collections (PR-3)

| Collection | Slug | Notes |
|------------|------|--------|
| `sites` | — | `CONTENT_SITE_SLUG=lingxia` |
| `articles` | Lexical | Blog, slug strategy A |
| `pages` | blocks | `about`, `privacy` |
| `faq-items` | localized Q/A | `site` + `sort` + `visible` |
| `characters` | `char-1/2/3` | Maps to home animation ids |
| `site-settings` | 1 per site | SEO, footer, noscript paragraph |
| `media` | uploads | |

### Blocks (pages `body`)

`richParagraph`, `image`, `quote`, `cta`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next + Payload on port **3001** |
| `npm run build` | Production build |
| `npm run seed` | Seed data (schema must exist) |
| `npm run seed:push` | `push` schema + seed (local dev) |
| `npm run generate:types` | Regenerate `payload-types.ts` |
| `npm run payload migrate` | Apply DB migrations |

## Environment

See `.env.example`. Key vars:

- `DATABASE_URI` — Postgres connection string
- `PAYLOAD_SECRET` — min 32 characters
- `PAYLOAD_PUBLIC_URL` — e.g. `http://localhost:3001`
- `HOME_URL` — e.g. `http://localhost:3000` (Live Preview target)
- `REVALIDATE_URL` / `REVALIDATE_SECRET` — home cache purge on save
- `PREVIEW_SECRET` — must match home `PREVIEW_SECRET`

### Preview + revalidate (local)

1. **Same secrets** in `lingxia-cms/.env` and `lingxia_home/.env`: `REVALIDATE_SECRET`, `PREVIEW_SECRET`
2. CMS: `REVALIDATE_URL=http://localhost:3000/api/revalidate`, `HOME_URL=http://localhost:3000`
3. Run `npm run seed:push` → copy logged **Home Preview API Key** to home `CONTENT_API_KEY`
   (user `home-preview@lingxia.local`, role `viewer` — do **not** use a platform-admin key)
4. Save an article in CMS → home `/zh-Hans/blog` updates without waiting for ISR
5. Use **Live Preview** in Admin, or open `/api/preview?secret=...&locale=zh-Hans&slug=menu&collection=articles`
6. Exit preview: `/api/preview/disable?locale=zh-Hans`

## RBAC v2 (PR-G5)

Data-driven roles in `roles` / `permissions` collections. Users have `roles[]` (hasMany) + optional `sites[]`.

| System role | Scope | Typical permissions |
|-------------|-------|---------------------|
| `platform-admin` | all sites | full platform + content |
| `site-admin` | assigned sites | content CRUD + publish + site-settings |
| `editor` | assigned sites | content CRUD + publish |
| `contributor` | assigned sites | create/update drafts only (no publish/delete) |
| `viewer` | assigned sites | read only |

- `npm run seed` upserts permissions/roles and migrates legacy `users.role` → `users.roles[]`.
- New users default to `editor`; assign `sites` for non–platform-admin roles.
- Production: keep at least two `platform-admin` accounts.

See [docs/cms-rbac-governance.md](../docs/cms-rbac-governance.md).

### Audit fields (PR-G2)

Articles / Pages / FAQ / Characters track `createdBy`, `updatedBy`, `publishedBy`, `firstPublishedAt` (auto via `beforeChange` hook). List views show `updatedBy`; sidebar shows full audit on edit.

### API Key (PR-G3)

- Seed creates `home-preview@lingxia.local` (`viewer`, sites=`lingxia`). Set `HOME_PREVIEW_API_KEY` in CMS `.env` for a fixed key.
- `CONTENT_API_KEY` on home must use that machine user — **never** a platform-admin key.
- All API Key requests are **read-only** (`user._strategy === 'api-key'` → write denied).

### Audit logs + author (PR-G4)

- `audit-logs` collection (`platform-admin` read only) — auto-written on content create/update/delete/publish.
- Articles have `author` (set on create); list view **Mine only** filter.

See [docs/api-contract.md](./docs/api-contract.md).
