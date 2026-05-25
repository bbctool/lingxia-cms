import type { Payload } from 'payload'

import { BYPASS_PUBLISH_GUARD } from '../hooks/publishGuard'
import { richParagraphBlock } from './lexical'

const seedContext = { [BYPASS_PUBLISH_GUARD]: true }

const ABOUT_ZH = [
  '灵虾致力于将易经、塔罗、占星、灵性疗愈等 200+ 东西方智慧与现代 AI 技术融合，为每一位用户提供有深度、有温度、可执行的人生指引。',
  '我们相信：在复杂多变的世界中，每个人内心都已有答案，灵虾只是帮你拨开迷雾、照见本心。',
  '产品支持 iOS 与 Android，三位风格迥异的 AI 向导随时陪伴你的解惑之旅。',
]

const ABOUT_EN = [
  'Lingxia blends 200+ Eastern and Western wisdom traditions with modern AI to offer thoughtful, actionable guidance.',
  'We believe answers already live within you—Lingxia helps clear the fog so you can see your path.',
  'Available on iOS and Android with three distinct AI guides for your journey.',
]

const PRIVACY_ZH = [
  '我们可能收集您注册账号时提供的手机号或邮箱、设备信息及使用日志，用于提供服务与改进产品体验。',
  '您的对话内容仅用于生成个性化回复，我们不会向第三方出售您的个人数据。经脱敏处理的数据可能用于模型优化。',
  '您有权查询、更正或删除个人账号信息。如需行使权利，请通过 App 内反馈或官网联系我们。',
  '如有隐私相关疑问，请发送邮件至 privacy@lingxia.com。',
]

const PRIVACY_EN = [
  'We may collect contact details, device information, and usage logs to provide and improve our services.',
  'Conversation data is used to generate personalized responses. We do not sell your personal data to third parties.',
  'You may request access, correction, or deletion of your account data via in-app feedback or our website.',
  'For privacy inquiries, email privacy@lingxia.com.',
]

const TERMS_ZH = [
  '欢迎使用灵虾（以下简称「本平台」）。在使用本平台服务前，请仔细阅读本用户服务条款（以下简称「本条款」）。',
  '当您访问或使用本平台服务，即表示您已阅读、理解并同意遵守本条款。如不同意，请立即停止使用。',
  '本平台有权更新本条款，更新后将发布于官网。您在条款变更后继续使用服务，视为接受修订后的条款。',
  '如有疑问，请发送邮件至 support@lingxia.com。',
]

const TERMS_EN = [
  'Welcome to Lingxia. Please read these Terms of Service before using our products.',
  'By accessing or using Lingxia, you agree to these terms. If you do not agree, please stop using the service.',
  'We may update these terms from time to time. Continued use after changes constitutes acceptance.',
  'For questions, contact support@lingxia.com.',
]

export async function seedPages(payload: Payload, siteId: number) {
  const now = new Date().toISOString()

  const pages = [
    {
      slug: 'about',
      layout: 'default' as const,
      zh: {
        title: '关于灵虾',
        blocks: ABOUT_ZH.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: '关于我们 - 灵虾',
          metaDescription: '了解灵虾团队与产品愿景：万象之中，自有答案。',
        },
      },
      en: {
        title: 'About Lingxia',
        blocks: ABOUT_EN.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: 'About - Lingxia',
          metaDescription: 'Learn about Lingxia and our vision.',
        },
      },
    },
    {
      slug: 'privacy',
      layout: 'legal' as const,
      zh: {
        title: '隐私政策',
        blocks: PRIVACY_ZH.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: '隐私政策 - 灵虾',
          metaDescription: '灵虾 App 隐私政策与用户数据保护说明。',
        },
      },
      en: {
        title: 'Privacy Policy',
        blocks: PRIVACY_EN.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: 'Privacy - Lingxia',
          metaDescription: 'Lingxia privacy policy and data protection.',
        },
      },
    },
    {
      slug: 'terms',
      layout: 'legal' as const,
      zh: {
        title: '服务条款',
        blocks: TERMS_ZH.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: '服务条款 - 灵虾',
          metaDescription: '灵虾用户服务条款与使用协议。',
        },
      },
      en: {
        title: 'Terms of Service',
        blocks: TERMS_EN.map((t) => richParagraphBlock(t)),
        seo: {
          metaTitle: 'Terms - Lingxia',
          metaDescription: 'Lingxia terms of service and user agreement.',
        },
      },
    },
  ]

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: page.slug } }, { site: { equals: siteId } }],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Page ${page.slug} already exists`)
      continue
    }

    const doc = await payload.create({
      collection: 'pages',
      data: {
        site: siteId,
        slug: page.slug,
        layout: page.layout,
        title: page.zh.title,
        body: page.zh.blocks,
        status: 'published',
        publishedAt: now,
        localesPublished: ['zh-Hans', 'en'],
        seo: page.zh.seo,
      },
      locale: 'zh-Hans',
      overrideAccess: true,
      context: seedContext,
    })

    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: {
        title: page.en.title,
        body: page.en.blocks,
        seo: page.en.seo,
      },
      locale: 'en',
      overrideAccess: true,
      context: seedContext,
    })

    console.log(`Created page: ${page.slug} (zh-Hans + en)`)
  }
}
