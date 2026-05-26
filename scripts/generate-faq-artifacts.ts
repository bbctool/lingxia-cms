import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FAQ_MD_PATH } from '../src/seed/lib/faq-source-path'
import { loadFaqSeedFromMarkdown, type FaqSeedItem } from '../src/seed/lib/parse-faq-md'

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const cmsRoot = path.resolve(scriptsDir, '..')

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function renderFaqItemsTs(items: FaqSeedItem[]): string {
  const rows = items
    .map(
      (item) => `  {
    question: ${JSON.stringify(item.question)},
    answer: ${JSON.stringify(item.answer)},
    sort: ${item.sort},
  }`,
    )
    .join(',\n')

  return `/** Auto-generated from lingxia_home/docs/FAQ.md — do not edit by hand. */
export const FAQ_SEED = [
${rows},
] as const
`
}

function renderFaqSql(items: FaqSeedItem[]): string {
  const inserts = items
    .map((item) => {
      return `
WITH inserted AS (
  INSERT INTO faq_items (site_id, sort, visible, updated_at, created_at)
  SELECT s.id, ${item.sort}, true, now(), now()
  FROM sites s
  WHERE s.slug = 'lingxia'
  RETURNING id
)
INSERT INTO faq_items_locales (question, answer, _locale, _parent_id)
SELECT ${escapeSql(item.question)}, ${escapeSql(item.answer)}, 'zh-Hans'::"_locales", inserted.id
FROM inserted;`
    })
    .join('\n')

  return `-- Auto-generated from lingxia_home/docs/FAQ.md
-- Requires Payload PR-3 schema: faq_items + faq_items_locales + sites.slug = 'lingxia'
-- Usage: psql "$DATABASE_URI" -f deploy/sql/seed-faq.sql

BEGIN;

DELETE FROM faq_items_locales
WHERE _parent_id IN (
  SELECT f.id FROM faq_items f
  INNER JOIN sites s ON s.id = f.site_id
  WHERE s.slug = 'lingxia'
);

DELETE FROM faq_items
WHERE site_id IN (SELECT id FROM sites WHERE slug = 'lingxia');
${inserts}

COMMIT;
`
}

function main() {
  const items = loadFaqSeedFromMarkdown()

  const seedOut = path.join(cmsRoot, 'src/seed/faq-items.ts')
  const sqlOut = path.join(cmsRoot, 'deploy/sql/seed-faq.sql')

  fs.mkdirSync(path.dirname(sqlOut), { recursive: true })
  fs.writeFileSync(seedOut, renderFaqItemsTs(items), 'utf8')
  fs.writeFileSync(sqlOut, renderFaqSql(items), 'utf8')

  console.log(`Generated ${items.length} FAQ item(s):`)
  console.log(`  ${path.relative(cmsRoot, seedOut)}`)
  console.log(`  ${path.relative(cmsRoot, sqlOut)}`)
  console.log(`Source: ${FAQ_MD_PATH}`)
}

main()
