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
  cors: [
    process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3001',
    'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3001',
    'http://localhost:3000',
  ].filter(Boolean),
  sharp,
  plugins: [],
})
