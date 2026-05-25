import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Permissions } from './collections/Permissions'
import { Roles } from './collections/Roles'
import { AuditLogs } from './collections/AuditLogs'
import { Articles } from './collections/Articles'
import { Characters } from './collections/Characters'
import { FaqItems } from './collections/FaqItems'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { SiteSettings } from './collections/SiteSettings'
import { Sites } from './collections/Sites'
import { Users } from './collections/Users'
import { DEFAULT_LOCALE, LOCALES } from './config/locales'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const connectionString =
  process.env.DATABASE_URI || process.env.DATABASE_URL || ''

/** Cookie auth checks Origin against csrf — include tunnel/IP/domain origins for test server. */
function collectAllowedOrigins(): string[] {
  const origins = new Set<string>()
  const add = (value?: string) => {
    if (!value) return
    for (const part of value.split(',')) {
      const origin = part.trim().replace(/\/$/, '')
      if (origin) origins.add(origin)
    }
  }

  add(process.env.PAYLOAD_PUBLIC_URL)
  add(process.env.HOME_URL)
  add(process.env.PAYLOAD_CSRF_ORIGINS)
  add(
    [
      'http://localhost:9001',
      'http://localhost:9000',
      'http://127.0.0.1:9001',
      'http://127.0.0.1:9000',
      'http://localhost:3001',
      'http://localhost:3000',
    ].join(','),
  )

  return [...origins]
}

const allowedOrigins = collectAllowedOrigins()

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: '灵虾内容管理',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Permissions,
    Roles,
    Users,
    Sites,
    AuditLogs,
    Media,
    Articles,
    Pages,
    FaqItems,
    Characters,
    SiteSettings,
  ],
  editor: lexicalEditor(),
  localization: {
    locales: LOCALES.map(({ code, label }) => ({ code, label })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Local dev: PAYLOAD_DB_PUSH=true npm run seed:push
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  cors: allowedOrigins,
  csrf: allowedOrigins,
  sharp,
  plugins: [],
})
