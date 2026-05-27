import type { Payload } from 'payload'

import { lexicalParagraph } from './lexical'

const SETTINGS_ZH = {
  brandName: '灵虾',
  defaultSeo: {
    metaTitle: '灵虾 - 万象之中，自有答案',
    metaDescription:
      '灵虾，你的随身解惑灵伴，融合200+东西方智慧的AI解惑伴侣。',
  },
  pageLabels: {
    blog: {
      title: '博客',
      description: '灵虾官方博客：塔罗、易经、占星与灵性成长指南。',
    },
    faq: {
      title: '常见问题',
      description: '灵虾 App 常见问题：下载、向导、隐私与使用说明。',
    },
    characters: {
      title: 'AI 向导',
      description: '认识灵虾的三位 AI 向导：代码问道者、宿命引燃者、幽径引灯使。',
    },
  },
  socialLinks: [
    { platform: 'wechat' as const, label: '微信', url: '#' },
    { platform: 'weibo' as const, label: '微博', url: '#' },
    { platform: 'xiaohongshu' as const, label: '小红书', url: '#' },
    { platform: 'douyin' as const, label: '抖音', url: '#' },
  ],
  downloadLinks: {
    appStore: { label: 'App Store', url: '#' },
    android: { label: 'Android', url: '#' },
  },
  homeSeoParagraph:
    '灵虾是一款融合易经、塔罗、占星等智慧的AI解惑伴侣，支持 iOS 与 Android。',
  footerCopy: lexicalParagraph('© 灵虾 Lingxia. 万象之中，自有答案。'),
}

const SETTINGS_EN = {
  brandName: 'FortuneClaw',
  defaultSeo: {
    metaTitle: 'Lingxia - Answers Within All Things',
    metaDescription:
      'Lingxia is your pocket AI guide blending 200+ wisdom traditions.',
  },
  pageLabels: {
    blog: {
      title: 'Blog',
      description: 'Guides on tarot, I Ching, astrology and spiritual growth.',
    },
    faq: {
      title: 'FAQ',
      description: 'Download, guides, privacy and how to use Lingxia.',
    },
    characters: {
      title: 'AI Guides',
      description: 'Meet Lingxia’s three AI guides.',
    },
  },
  socialLinks: [
    { platform: 'wechat' as const, label: 'WeChat', url: '#' },
    { platform: 'weibo' as const, label: 'Weibo', url: '#' },
    { platform: 'xiaohongshu' as const, label: 'Xiaohongshu', url: '#' },
    { platform: 'douyin' as const, label: 'Douyin', url: '#' },
  ],
  downloadLinks: {
    appStore: { label: 'App Store', url: '#' },
    android: { label: 'Android', url: '#' },
  },
  homeSeoParagraph:
    'Lingxia blends Eastern and Western wisdom on iOS and Android.',
  footerCopy: lexicalParagraph('© Lingxia. Answers within all things.'),
}

export async function seedSiteSettings(payload: Payload, siteId: number) {
  const existing = await payload.find({
    collection: 'site-settings',
    where: { site: { equals: siteId } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'site-settings',
      id: existing.docs[0].id,
      data: {
        brandName: SETTINGS_ZH.brandName,
        themePreset: 'lingxia-gold',
        pageLabels: SETTINGS_ZH.pageLabels,
        socialLinks: SETTINGS_ZH.socialLinks,
        downloadLinks: SETTINGS_ZH.downloadLinks,
      },
      locale: 'zh-Hans',
    })
    await payload.update({
      collection: 'site-settings',
      id: existing.docs[0].id,
      data: {
        brandName: SETTINGS_EN.brandName,
        pageLabels: SETTINGS_EN.pageLabels,
        socialLinks: SETTINGS_EN.socialLinks,
        downloadLinks: SETTINGS_EN.downloadLinks,
      },
      locale: 'en',
    })
    console.log('Site settings updated with pageLabels + brandName')
    return
  }

  const doc = await payload.create({
    collection: 'site-settings',
    data: {
      site: siteId,
      themePreset: 'lingxia-gold',
      ...SETTINGS_ZH,
    },
    locale: 'zh-Hans',
  })

  await payload.update({
    collection: 'site-settings',
    id: doc.id,
    data: SETTINGS_EN,
    locale: 'en',
  })

  console.log('Created site-settings (zh-Hans + en)')
}
