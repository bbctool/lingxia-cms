import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Payload } from 'payload'

const seedDir = path.dirname(fileURLToPath(import.meta.url))
const homePublicDir = path.resolve(seedDir, '../../../lingxia_home/public')

/** Frame 2/3/4 → 合理性 / 专业性 / 价值感 */
const CHAPTER_ONE_PILLAR_MEDIA = [
  {
    fileName: 'Frame 2.png',
    alt: 'home-chapter-01-pillar-1-clarity',
  },
  {
    fileName: 'Frame 3.png',
    alt: 'home-chapter-01-pillar-2-depth',
  },
  {
    fileName: 'Frame 4.png',
    alt: 'home-chapter-01-pillar-3-companionship',
  },
] as const

type PillarCopy = { title: string; body: string; image?: number }
type ChapterOneCopy = {
  eyebrow: string
  title: string
  pillars: PillarCopy[]
}

async function upsertChapterOneMedia(payload: Payload): Promise<number[]> {
  const ids: number[] = []

  for (const item of CHAPTER_ONE_PILLAR_MEDIA) {
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: item.alt } },
      limit: 1,
    })

    if (existing.docs[0]) {
      ids.push(Number(existing.docs[0].id))
      continue
    }

    const filePath = path.join(homePublicDir, item.fileName)
    const created = await payload.create({
      collection: 'media',
      data: { alt: item.alt },
      filePath,
      overrideAccess: true,
    })

    ids.push(Number(created.id))
    console.log(`Media seeded: ${item.fileName} (${item.alt})`)
  }

  return ids
}

function withPillarImages<T extends ChapterOneCopy>(
  chapterOne: T,
  imageIds: number[],
): T {
  return {
    ...chapterOne,
    pillars: chapterOne.pillars.map((pillar, index) => ({
      ...pillar,
      image: imageIds[index],
    })),
  }
}

const HOME_ZH = {
  title: '灵虾首页',
  hero: {
    headline: '万象之中 · 自有答案',
    tagline: '灵虾，你的随身解惑灵伴，融合200+东西方智慧',
  },
  heroSocial: {
    dividerText: '关注我们，了解更多',
  },
  chapterOne: {
    eyebrow: 'Chapter 01',
    title: '这不是算命产品，而是为你定制的人生向导',
    pillars: [
      {
        title: '合理性',
        body: '不用研究复杂命盘，也不必纠结该相信哪一种体系。\n你只需要说出情绪与困惑，灵虾会通过 AI 自动理解你的状态，并从更适合的命理体系中，替你找到属于当下的回应与方向。',
      },
      {
        title: '专业性',
        body: '灵虾融合紫微斗数、八字、占星、塔罗、梦境解析等多体系能力，并结合长期记忆与命理数据库，让每一次分析，不只是情绪安慰，而是真正建立在长期推演与多维交叉验证之上的解读体验。',
      },
      {
        title: '价值感',
        body: '灵虾不是一个只会给答案的 AI。\n它会慢慢记住你的情绪、关系与人生阶段，在一次次对话里，陪你看清那些放不下的人、反复出现的情绪，以及人生正在发生的变化。\n因为很多时候，人真正想寻找的，\n并不是结果。\n而是：有人能够一直认真理解自己。',
      },
    ],
  },
  chapterTwo: {
    eyebrow: 'Chapter 02',
    title: '为什么我们需要重构数字陪伴体验？',
    cards: [
      {
        num: '01',
        title: '消除焦虑',
        desc: '人不怕坏结果，更怕不可控。系统旨在重建现实生活的确定感。',
        dialogueTitle: '当感到迷茫时',
        userContent:
          '最近找工作到处碰壁，感觉未来一片迷茫，每天都很焦虑，我还能找到方向吗？',
        aiContent:
          '我看到了你星盘中的土星正经过事业宫。现在的停滞其实是在为你积蓄能量，与其内耗，不如先梳理手头的资源，我会陪你一起找回内心的锚点。',
        flipCards: ['02', '03'],
      },
      {
        num: '02',
        title: '身份重构',
        desc: '传统身份标签瓦解，在这里获得"我是谁""我为何这样"的自我解释。',
        dialogueTitle: '当自我怀疑时',
        userContent:
          '总觉得跟周围人格格不入，朋友换了很多个人，依然觉得没人在真正懂我，我的性格是不是有问题？',
        aiContent:
          '作为INTJ，你的内耗往往来自于用外向者的标准衡量自己。高敏感不是缺陷，那是你能洞察事物本质的天赋。让我们重新定义你的边界与舒适区。',
        flipCards: ['03', '04'],
      },
      {
        num: '03',
        title: '情感托底',
        desc: '情绪化场景中最需要一个安全的空间，去被看见、被安抚、被赋义。',
        dialogueTitle: '当情绪崩溃时',
        userContent:
          '一段感情刚结束，感觉心里空了一大块，每天都在崩溃边缘，我该怎么走出来？',
        aiContent:
          '我理解这种剥落般的痛感。分离从来都不是一次性的动作，而是一个缓慢结痂的过程。今晚如果你又感到难过，让我为你做一次深度的占卜安抚。',
        flipCards: ['01', '02'],
      },
      {
        num: '04',
        title: '意义寻回',
        desc: '现实无解时，转向象征与宇宙的宏观视角，赋予经历厚度与意义。',
        dialogueTitle: '当追寻意义时',
        userContent:
          '日子一天天过去，工作只是为了在这个城市活下去。生活不该只是这样，那我的意义到底在哪？',
        aiContent:
          '塔罗的命运之轮正在悄悄轮转。当你开始问『意义』时，觉醒的发条就开始了。试着从小习惯打破日常，宇宙会给你新的暗示与答案。',
        flipCards: ['02', '03'],
      },
    ],
  },
  ctaSection: {
    title: '不是替你决定人生，\n而是在迷茫时陪你看清前路',
    subtitle: '建立你的专属精神连接，开启深刻的人生解释与陪伴之旅。',
    primaryCta: '立即下载 App',
    secondaryCtas: [
      { label: 'Discord 社区', url: '#' },
      { label: '关注 Twitter', url: '#' },
    ],
  },
  seo: {
    metaTitle: '灵虾 - 万象之中，自有答案',
    metaDescription:
      '灵虾，你的随身解惑灵伴，融合200+东西方智慧的AI解惑伴侣。',
  },
}

const HOME_EN = {
  title: 'Lingxia Home',
  hero: {
    headline: 'Within All Things · Answers Await',
    tagline:
      'Lingxia — your pocket guide blending 200+ Eastern and Western wisdom traditions',
  },
  heroSocial: {
    dividerText: 'Follow us to learn more',
  },
  chapterOne: {
    eyebrow: 'Chapter 01',
    title: 'Not fortune-telling — a guide tailored to your life',
    pillars: [
      {
        title: 'Clarity',
        body: 'No complex charts or choosing which system to trust.\nShare how you feel — Lingxia reads your state with AI and responds from the tradition that fits this moment.',
      },
      {
        title: 'Depth',
        body: 'Zi Wei, BaZi, astrology, tarot, dream work, long-term memory, and a structured knowledge base — each reading is cross-checked, not just comfort.',
      },
      {
        title: 'Companionship',
        body: 'Lingxia is not an answer machine.\nIt remembers your moods, relationships, and life stages — and stays with you through what keeps returning.\nOften what we seek is not a result,\nbut someone who keeps understanding us.',
      },
    ],
  },
  chapterTwo: {
    eyebrow: 'Chapter 02',
    title: 'Why we need to reinvent digital companionship',
    cards: [
      {
        num: '01',
        title: 'Ease anxiety',
        desc: 'People fear uncertainty more than bad outcomes. We rebuild a sense of control.',
        dialogueTitle: 'When lost',
        userContent:
          'Job search after job search — I feel stuck and anxious. Is there still a path for me?',
        aiContent:
          'Saturn crossing your career house suggests a pause that gathers strength. Let us map your resources and find your anchor together.',
        flipCards: ['02', '03'],
      },
      {
        num: '02',
        title: 'Identity',
        desc: 'When old labels fail, find language for who you are and why.',
        dialogueTitle: 'When doubting yourself',
        userContent:
          'I never fit in. Is something wrong with my personality?',
        aiContent:
          'As an INTJ, you measure yourself by extrovert standards. High sensitivity is insight — let us redefine your boundaries.',
        flipCards: ['03', '04'],
      },
      {
        num: '03',
        title: 'Emotional hold',
        desc: 'A safe space to be seen, soothed, and given meaning.',
        dialogueTitle: 'When breaking down',
        userContent:
          'A relationship ended and I feel hollow every day. How do I heal?',
        aiContent:
          'Grief is not one moment but a slow mending. Tonight, if it hurts again, let me offer a reading that holds you.',
        flipCards: ['01', '02'],
      },
      {
        num: '04',
        title: 'Meaning',
        desc: 'When life feels flat, symbolic and cosmic lenses add depth.',
        dialogueTitle: 'When seeking purpose',
        userContent:
          'Work is just survival. Where is the meaning in my life?',
        aiContent:
          'The Wheel of Fortune is turning. Asking about meaning is already awakening — small rituals will bring new signs.',
        flipCards: ['02', '03'],
      },
    ],
  },
  ctaSection: {
    title: 'Not deciding your life for you —\nwalking beside you when the path is unclear',
    subtitle:
      'Build your spiritual connection and begin a journey of interpretation and companionship.',
    primaryCta: 'Download the app',
    secondaryCtas: [
      { label: 'Discord', url: '#' },
      { label: 'Follow on X', url: '#' },
    ],
  },
  seo: {
    metaTitle: 'Lingxia - Answers Within All Things',
    metaDescription:
      'Lingxia is your pocket AI guide blending 200+ wisdom traditions.',
  },
}

export async function seedHomePage(payload: Payload, siteId: number) {
  const now = new Date().toISOString()
  const pillarImageIds = await upsertChapterOneMedia(payload)
  const chapterOneZh = withPillarImages(HOME_ZH.chapterOne, pillarImageIds)
  const chapterOneEn = withPillarImages(HOME_EN.chapterOne, pillarImageIds)

  const existing = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: 'home' } }, { site: { equals: siteId } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'pages',
      id,
      data: {
        chapterOne: chapterOneZh,
        chapterTwo: HOME_ZH.chapterTwo,
      },
      locale: 'zh-Hans',
    })
    await payload.update({
      collection: 'pages',
      id,
      data: {
        chapterOne: chapterOneEn,
        chapterTwo: HOME_EN.chapterTwo,
      },
      locale: 'en',
    })
    console.log('Page home chapterOne pillars updated')
    return
  }

  const doc = await payload.create({
    collection: 'pages',
    data: {
      site: siteId,
      slug: 'home',
      layout: 'landing',
      title: HOME_ZH.title,
      status: 'published',
      publishedAt: now,
      localesPublished: ['zh-Hans', 'en'],
      hero: HOME_ZH.hero,
      heroSocial: HOME_ZH.heroSocial,
      chapterOne: chapterOneZh,
      chapterTwo: HOME_ZH.chapterTwo,
      ctaSection: HOME_ZH.ctaSection,
      seo: HOME_ZH.seo,
    },
    locale: 'zh-Hans',
  })

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      title: HOME_EN.title,
      hero: HOME_EN.hero,
      heroSocial: HOME_EN.heroSocial,
      chapterOne: chapterOneEn,
      chapterTwo: HOME_EN.chapterTwo,
      ctaSection: HOME_EN.ctaSection,
      seo: HOME_EN.seo,
    },
    locale: 'en',
  })

  console.log('Created page: home (zh-Hans + en)')
}
