import { createRequire } from 'node:module'
import { getPayload } from 'payload'

import { seedFaq } from '../src/seed/faq'

const require = createRequire(import.meta.url)

function loadEnv() {
  require('@next/env').loadEnvConfig(process.cwd())
}

async function main() {
  loadEnv()

  const secret = process.env.PAYLOAD_SECRET ?? ''
  if (secret.length < 32) {
    throw new Error('PAYLOAD_SECRET is missing or too short (min 32 chars).')
  }

  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const siteResult = await payload.find({
    collection: 'sites',
    where: { slug: { equals: 'lingxia' } },
    limit: 1,
  })

  const siteDoc = siteResult.docs[0]
  if (!siteDoc) {
    throw new Error('Site "lingxia" not found. Run npm run seed first.')
  }

  await seedFaq(payload, Number(siteDoc.id))
  console.log('FAQ seed complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
