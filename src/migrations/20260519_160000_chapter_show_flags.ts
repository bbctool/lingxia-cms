import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales"
    ADD COLUMN IF NOT EXISTS "chapter_one_show_eyebrow" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "chapter_one_show_title" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "chapter_one_show_pillar_title" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "chapter_one_show_pillar_body" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "chapter_two_show_eyebrow" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "chapter_two_show_title" boolean DEFAULT true;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales"
    DROP COLUMN IF EXISTS "chapter_one_show_eyebrow",
    DROP COLUMN IF EXISTS "chapter_one_show_title",
    DROP COLUMN IF EXISTS "chapter_one_show_pillar_title",
    DROP COLUMN IF EXISTS "chapter_one_show_pillar_body",
    DROP COLUMN IF EXISTS "chapter_two_show_eyebrow",
    DROP COLUMN IF EXISTS "chapter_two_show_title";`)
}
