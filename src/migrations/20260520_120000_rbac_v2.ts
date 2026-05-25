import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_permissions_resource" AS ENUM(
    'articles', 'pages', 'faq-items', 'characters', 'media',
    'site-settings', 'sites', 'users', 'roles', 'audit-logs'
   );
   CREATE TYPE "public"."enum_permissions_action" AS ENUM(
    'read', 'create', 'update', 'delete', 'publish', 'manage'
   );

   CREATE TABLE "permissions" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar NOT NULL,
    "label" varchar NOT NULL,
    "resource" "enum_permissions_resource" NOT NULL,
    "action" "enum_permissions_action" NOT NULL,
    "description" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "roles" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar NOT NULL,
    "name" varchar NOT NULL,
    "description" varchar,
    "is_system" boolean DEFAULT false,
    "all_sites" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "roles_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "permissions_id" integer
   );

   ALTER TABLE "users_rels" ADD COLUMN IF NOT EXISTS "roles_id" integer;

   CREATE UNIQUE INDEX "permissions_slug_idx" ON "permissions" USING btree ("slug");
   CREATE INDEX "permissions_updated_at_idx" ON "permissions" USING btree ("updated_at");
   CREATE INDEX "permissions_created_at_idx" ON "permissions" USING btree ("created_at");
   CREATE UNIQUE INDEX "roles_slug_idx" ON "roles" USING btree ("slug");
   CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
   CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
   CREATE INDEX "roles_rels_order_idx" ON "roles_rels" USING btree ("order");
   CREATE INDEX "roles_rels_parent_idx" ON "roles_rels" USING btree ("parent_id");
   CREATE INDEX "roles_rels_path_idx" ON "roles_rels" USING btree ("path");
   CREATE INDEX "roles_rels_permissions_id_idx" ON "roles_rels" USING btree ("permissions_id");
   CREATE INDEX "users_rels_roles_id_idx" ON "users_rels" USING btree ("roles_id");

   ALTER TABLE "roles_rels" ADD CONSTRAINT "roles_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "roles_rels" ADD CONSTRAINT "roles_rels_permissions_fk"
    FOREIGN KEY ("permissions_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_roles_fk"
    FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "permissions_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "roles_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_permissions_fk"
    FOREIGN KEY ("permissions_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk"
    FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_permissions_id_idx"
    ON "payload_locked_documents_rels" USING btree ("permissions_id");
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_roles_id_idx"
    ON "payload_locked_documents_rels" USING btree ("roles_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_permissions_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_roles_fk";
   DROP INDEX IF EXISTS "payload_locked_documents_rels_permissions_id_idx";
   DROP INDEX IF EXISTS "payload_locked_documents_rels_roles_id_idx";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "permissions_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "roles_id";

   ALTER TABLE "users_rels" DROP CONSTRAINT IF EXISTS "users_rels_roles_fk";
   DROP INDEX IF EXISTS "users_rels_roles_id_idx";
   ALTER TABLE "users_rels" DROP COLUMN IF EXISTS "roles_id";

   DROP TABLE IF EXISTS "roles_rels" CASCADE;
   DROP TABLE IF EXISTS "roles" CASCADE;
   DROP TABLE IF EXISTS "permissions" CASCADE;
   DROP TYPE IF EXISTS "enum_permissions_resource";
   DROP TYPE IF EXISTS "enum_permissions_action";`)
}
