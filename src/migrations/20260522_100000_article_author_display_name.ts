import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "articles" ADD COLUMN "author_display_name" varchar;

  UPDATE "articles" AS a
  SET "author_display_name" = COALESCE(NULLIF(u."display_name", ''), u."email")
  FROM "users" AS u
  WHERE a."author_id" = u."id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "author_display_name";`)
}
