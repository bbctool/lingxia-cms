import { createRequire } from 'node:module'
import { getPayload } from 'payload'

import { seedRbac } from './rbac'
import { seedCharacters } from './characters'
import { seedFaq } from './faq'
import { seedHomePage } from './home-page'
import { seedPages } from './pages'
import { seedPreviewUser } from './preview-user'
import { seedSiteSettings } from './site-settings'

const require = createRequire(import.meta.url)

function loadEnv() {
  require('@next/env').loadEnvConfig(process.cwd())
}

async function seed() {
  loadEnv()
  const secret = process.env.PAYLOAD_SECRET ?? ''
  if (secret.length < 32) {
    throw new Error(
      'PAYLOAD_SECRET is missing or too short (min 32 chars). Copy lingxia-cms/.env.example to .env and set PAYLOAD_SECRET.',
    )
  }

  const { default: config } = await import('../payload.config.js')
  const payload = await getPayload({ config })

  await seedRbac(payload)

  const siteResult = await payload.find({
    collection: 'sites',
    where: { slug: { equals: 'lingxia' } },
    limit: 1,
  })

  let siteDoc = siteResult.docs[0]

  if (!siteDoc) {
    siteDoc = await payload.create({
      collection: 'sites',
      data: {
        slug: 'lingxia',
        name: '灵虾',
        primaryDomain: 'https://lingxia.com',
        defaultLocale: 'zh-Hans',
        enabledLocales: ['zh-Hans', 'zh-Hant', 'en', 'ja', 'ko'],
      },
      locale: 'zh-Hans',
    })
    console.log('Created site: lingxia')
  } else {
    console.log('Site lingxia already exists')
  }

  const siteId = Number(siteDoc.id)
  const now = new Date().toISOString()

  const existingArticle = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { slug: { equals: 'test-post' } },
        { site: { equals: siteId } },
      ],
    },
    limit: 1,
  })

  if (existingArticle.docs.length === 0) {
    await payload.create({
      collection: 'articles',
      data: {
        site: siteId,
        slug: 'test-post',
        title: '测试文章：灵虾内容平台',
        excerpt: '用于验证 Localization 与 Articles API 的示例文章。',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '这是简体中文正文。Welcome to the Lingxia content hub.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        status: 'published',
        publishedAt: now,
        localesPublished: ['zh-Hans', 'en'],
        tags: ['测试'],
        seo: {
          metaTitle: '测试文章 - 灵虾',
          metaDescription: 'CMS PR-1 验收用示例文章',
        },
      },
      locale: 'zh-Hans',
    })

    await payload.update({
      collection: 'articles',
      id: (
        await payload.find({
          collection: 'articles',
          where: {
            and: [
              { slug: { equals: 'test-post' } },
              { site: { equals: siteId } },
            ],
          },
          limit: 1,
        })
      ).docs[0].id,
      data: {
        title: 'Test Post: Lingxia Content Hub',
        excerpt: 'Sample article for Localization and Articles API verification.',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'This is the English body for the same slug (strategy A).',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      locale: 'en',
    })

    console.log('Created article: test-post (zh-Hans + en)')
  } else {
    console.log('Article test-post already exists')
  }

  await seedFaq(payload, siteId)
  await seedPages(payload, siteId)
  await seedHomePage(payload, siteId)
  await seedCharacters(payload, siteId)
  await seedSiteSettings(payload, siteId)
  await seedPreviewUser(payload, siteId)

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
