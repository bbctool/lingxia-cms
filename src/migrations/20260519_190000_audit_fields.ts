import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles"
    ADD COLUMN "created_by_id" integer,
    ADD COLUMN "updated_by_id" integer,
    ADD COLUMN "published_by_id" integer,
    ADD COLUMN "first_published_at" timestamp(3) with time zone;
   ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "articles" ADD CONSTRAINT "articles_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "articles_created_by_idx" ON "articles" USING btree ("created_by_id");
   CREATE INDEX "articles_updated_by_idx" ON "articles" USING btree ("updated_by_id");
   CREATE INDEX "articles_published_by_idx" ON "articles" USING btree ("published_by_id");

   ALTER TABLE "pages"
    ADD COLUMN "created_by_id" integer,
    ADD COLUMN "updated_by_id" integer,
    ADD COLUMN "published_by_id" integer,
    ADD COLUMN "first_published_at" timestamp(3) with time zone;
   ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages" ADD CONSTRAINT "pages_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
   CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
   CREATE INDEX "pages_published_by_idx" ON "pages" USING btree ("published_by_id");

   ALTER TABLE "faq_items"
    ADD COLUMN "created_by_id" integer,
    ADD COLUMN "updated_by_id" integer,
    ADD COLUMN "published_by_id" integer,
    ADD COLUMN "first_published_at" timestamp(3) with time zone;
   ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "faq_items_created_by_idx" ON "faq_items" USING btree ("created_by_id");
   CREATE INDEX "faq_items_updated_by_idx" ON "faq_items" USING btree ("updated_by_id");
   CREATE INDEX "faq_items_published_by_idx" ON "faq_items" USING btree ("published_by_id");

   ALTER TABLE "characters"
    ADD COLUMN "created_by_id" integer,
    ADD COLUMN "updated_by_id" integer,
    ADD COLUMN "published_by_id" integer,
    ADD COLUMN "first_published_at" timestamp(3) with time zone;
   ALTER TABLE "characters" ADD CONSTRAINT "characters_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "characters" ADD CONSTRAINT "characters_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "characters" ADD CONSTRAINT "characters_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "characters_created_by_idx" ON "characters" USING btree ("created_by_id");
   CREATE INDEX "characters_updated_by_idx" ON "characters" USING btree ("updated_by_id");
   CREATE INDEX "characters_published_by_idx" ON "characters" USING btree ("published_by_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_created_by_id_users_id_fk";
   ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_updated_by_id_users_id_fk";
   ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_published_by_id_users_id_fk";
   DROP INDEX IF EXISTS "articles_created_by_idx";
   DROP INDEX IF EXISTS "articles_updated_by_idx";
   DROP INDEX IF EXISTS "articles_published_by_idx";
   ALTER TABLE "articles"
    DROP COLUMN IF EXISTS "created_by_id",
    DROP COLUMN IF EXISTS "updated_by_id",
    DROP COLUMN IF EXISTS "published_by_id",
    DROP COLUMN IF EXISTS "first_published_at";

   ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_created_by_id_users_id_fk";
   ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_updated_by_id_users_id_fk";
   ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_published_by_id_users_id_fk";
   DROP INDEX IF EXISTS "pages_created_by_idx";
   DROP INDEX IF EXISTS "pages_updated_by_idx";
   DROP INDEX IF EXISTS "pages_published_by_idx";
   ALTER TABLE "pages"
    DROP COLUMN IF EXISTS "created_by_id",
    DROP COLUMN IF EXISTS "updated_by_id",
    DROP COLUMN IF EXISTS "published_by_id",
    DROP COLUMN IF EXISTS "first_published_at";

   ALTER TABLE "faq_items" DROP CONSTRAINT IF EXISTS "faq_items_created_by_id_users_id_fk";
   ALTER TABLE "faq_items" DROP CONSTRAINT IF EXISTS "faq_items_updated_by_id_users_id_fk";
   ALTER TABLE "faq_items" DROP CONSTRAINT IF EXISTS "faq_items_published_by_id_users_id_fk";
   DROP INDEX IF EXISTS "faq_items_created_by_idx";
   DROP INDEX IF EXISTS "faq_items_updated_by_idx";
   DROP INDEX IF EXISTS "faq_items_published_by_idx";
   ALTER TABLE "faq_items"
    DROP COLUMN IF EXISTS "created_by_id",
    DROP COLUMN IF EXISTS "updated_by_id",
    DROP COLUMN IF EXISTS "published_by_id",
    DROP COLUMN IF EXISTS "first_published_at";

   ALTER TABLE "characters" DROP CONSTRAINT IF EXISTS "characters_created_by_id_users_id_fk";
   ALTER TABLE "characters" DROP CONSTRAINT IF EXISTS "characters_updated_by_id_users_id_fk";
   ALTER TABLE "characters" DROP CONSTRAINT IF EXISTS "characters_published_by_id_users_id_fk";
   DROP INDEX IF EXISTS "characters_created_by_idx";
   DROP INDEX IF EXISTS "characters_updated_by_idx";
   DROP INDEX IF EXISTS "characters_published_by_idx";
   ALTER TABLE "characters"
    DROP COLUMN IF EXISTS "created_by_id",
    DROP COLUMN IF EXISTS "updated_by_id",
    DROP COLUMN IF EXISTS "published_by_id",
    DROP COLUMN IF EXISTS "first_published_at";`)
}
