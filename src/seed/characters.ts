import type { Payload } from 'payload'

import { BYPASS_PUBLISH_GUARD } from '../hooks/publishGuard'

const seedContext = { [BYPASS_PUBLISH_GUARD]: true }

const PERSONA_KEY_BY_SLUG: Record<string, string> = {
  'char-1': 'daozhang',
  'char-2': 'tarot',
  'char-3': 'xiaohuxian',
  'char-4': 'xiaohuxian',
  'char-5': 'xiaohuxian',
  'char-6': 'xiaohuxian',
  'char-7': 'xiaohuxian',
}

function characterPaths(index: number) {
  const avatarPath =
    index === 1
      ? '/Character1_HalfBody.png'
      : `/Character${index}_NoBackground.png`
  return {
    avatarPath,
    imagePath: `/Character${index}_FullBody.png`,
    bgPath: '',
  }
}

const CHARACTERS = [
  {
    slug: 'char-1',
    sort: 10,
    ...characterPaths(1),
    zh: {
      name: '代码问道者',
      title: 'I Ching & Tech Analyst',
      tagline: '以代码穷尽推演，在卦象中洞见程序的本质',
      description:
        '一位身披传统长衫手持Macbook的智者。他将东方古老的易经哲学与现代计算机科学的算法逻辑完美熔接。不会用虚无缥缈的话语敷衍你，而是像debug一样帮你剖析生活困境的底层逻辑，提供极具现实指导意义和执行性的策略。',
      system: '易经 / MBTI / 逻辑推演',
      traits: ['理性', '极客精神', '策略导向', '一针见血'],
    },
    en: {
      name: 'Code Oracle',
      title: 'I Ching & Tech Analyst',
      tagline: 'Debug life with the logic of hexagrams and code',
      description:
        'A sage in traditional robes with a MacBook, merging I Ching philosophy with computer science to deliver practical, actionable strategies.',
      system: 'I Ching / MBTI / Logic',
      traits: ['Rational', 'Geek spirit', 'Strategic', 'Direct'],
    },
  },
  {
    slug: 'char-2',
    sort: 20,
    ...characterPaths(2),
    zh: {
      name: '宿命引燃者',
      title: 'Tarot & Astrologer',
      tagline: '引燃命运的牌局，透视潜意识的赛博暗流',
      description:
        '手持燃烧塔罗牌的前卫赛博少女。她以极其敏锐的直觉游走于宏观星象与微观牌阵之间。不受传统束缚，擅长用最现代的视角解码你的情感关联与生命课题。',
      system: '塔罗 / 占星 / 星盘合盘',
      traits: ['前卫', '直觉导向', '神秘', '灵魂共振'],
    },
    en: {
      name: 'Fate Igniter',
      title: 'Tarot & Astrologer',
      tagline: 'Ignite the cards, read the cyber undercurrent of soul',
      description:
        'A cyberpunk girl with burning tarot cards, decoding relationships and life themes through astrology and intuition.',
      system: 'Tarot / Astrology',
      traits: ['Avant-garde', 'Intuitive', 'Mysterious', 'Resonant'],
    },
  },
  {
    slug: 'char-3',
    sort: 30,
    ...characterPaths(3),
    zh: {
      name: '幽径引灯使',
      title: 'Soul Healer',
      tagline: '提灯照亮意识的幽暗，用狐火温热冰冷的心域',
      description:
        '有着三条狐尾的灵性少女，手持摇曳的古木灯笼。她不判断对错，不推测凶吉，只是一位专注倾听与能量护佑的疗愈者。',
      system: '灵性疗愈 / 脉轮 / 能量护佑',
      traits: ['治愈', '庇护', '包容', '灵性启迪'],
    },
    en: {
      name: 'Lantern Guide',
      title: 'Soul Healer',
      tagline: 'Light the dark paths of consciousness with foxfire warmth',
      description:
        'A spirit girl with three fox tails and an ancient lantern, offering listening and energy healing without judgment.',
      system: 'Spiritual healing / Chakra',
      traits: ['Healing', 'Sheltering', 'Inclusive', 'Inspiring'],
    },
  },
  {
    slug: 'char-4',
    sort: 40,
    ...characterPaths(4),
    zh: {
      name: '幽径引灯使',
      title: 'Soul Healer',
      tagline: '提灯照亮意识的幽暗，用狐火温热冰冷的心域',
      description: '有着三条狐尾的灵性少女，手持摇曳的古木灯笼。',
      system: '灵性疗愈 / 脉轮 / 能量护佑',
      traits: ['治愈', '庇护', '包容', '灵性启迪'],
    },
    en: {
      name: 'Lantern Guide',
      title: 'Soul Healer',
      tagline: 'Light the dark paths of consciousness with foxfire warmth',
      description:
        'A spirit guide with an ancient lantern, offering listening and energy healing.',
      system: 'Spiritual healing / Chakra',
      traits: ['Healing', 'Sheltering', 'Inclusive', 'Inspiring'],
    },
  },
  {
    slug: 'char-5',
    sort: 50,
    ...characterPaths(5),
    zh: {
      name: '幽径引灯使',
      title: 'Soul Healer',
      tagline: '提灯照亮意识的幽暗，用狐火温热冰冷的心域',
      description: '有着三条狐尾的灵性少女，手持摇曳的古木灯笼。',
      system: '灵性疗愈 / 脉轮 / 能量护佑',
      traits: ['治愈', '庇护', '包容', '灵性启迪'],
    },
    en: {
      name: 'Lantern Guide',
      title: 'Soul Healer',
      tagline: 'Light the dark paths of consciousness with foxfire warmth',
      description:
        'A spirit guide with an ancient lantern, offering listening and energy healing.',
      system: 'Spiritual healing / Chakra',
      traits: ['Healing', 'Sheltering', 'Inclusive', 'Inspiring'],
    },
  },
  {
    slug: 'char-6',
    sort: 60,
    ...characterPaths(6),
    zh: {
      name: '幽径引灯使',
      title: 'Soul Healer',
      tagline: '提灯照亮意识的幽暗，用狐火温热冰冷的心域',
      description: '有着三条狐尾的灵性少女，手持摇曳的古木灯笼。',
      system: '灵性疗愈 / 脉轮 / 能量护佑',
      traits: ['治愈', '庇护', '包容', '灵性启迪'],
    },
    en: {
      name: 'Lantern Guide',
      title: 'Soul Healer',
      tagline: 'Light the dark paths of consciousness with foxfire warmth',
      description:
        'A spirit guide with an ancient lantern, offering listening and energy healing.',
      system: 'Spiritual healing / Chakra',
      traits: ['Healing', 'Sheltering', 'Inclusive', 'Inspiring'],
    },
  },
  {
    slug: 'char-7',
    sort: 70,
    ...characterPaths(7),
    zh: {
      name: '幽径引灯使',
      title: 'Soul Healer',
      tagline: '提灯照亮意识的幽暗，用狐火温热冰冷的心域',
      description: '有着三条狐尾的灵性少女，手持摇曳的古木灯笼。',
      system: '灵性疗愈 / 脉轮 / 能量护佑',
      traits: ['治愈', '庇护', '包容', '灵性启迪'],
    },
    en: {
      name: 'Lantern Guide',
      title: 'Soul Healer',
      tagline: 'Light the dark paths of consciousness with foxfire warmth',
      description:
        'A spirit guide with an ancient lantern, offering listening and energy healing.',
      system: 'Spiritual healing / Chakra',
      traits: ['Healing', 'Sheltering', 'Inclusive', 'Inspiring'],
    },
  },
] as const

async function upsertCharacter(
  payload: Payload,
  siteId: number,
  char: (typeof CHARACTERS)[number],
) {
  const existing = await payload.find({
    collection: 'characters',
    where: {
      and: [{ slug: { equals: char.slug } }, { site: { equals: siteId } }],
    },
    limit: 1,
  })

  const zhData = {
    site: siteId,
    slug: char.slug,
    personaKey: PERSONA_KEY_BY_SLUG[char.slug] ?? char.slug,
    sort: char.sort,
    visible: true,
    avatarPath: char.avatarPath,
    imagePath: char.imagePath,
    bgPath: char.bgPath,
    name: char.zh.name,
    title: char.zh.title,
    tagline: char.zh.tagline,
    description: char.zh.description,
    system: char.zh.system,
    traits: [...char.zh.traits],
  }

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    await payload.update({
      collection: 'characters',
      id,
      data: zhData,
      locale: 'zh-Hans',
      overrideAccess: true,
      context: seedContext,
    })
    await payload.update({
      collection: 'characters',
      id,
      data: {
        name: char.en.name,
        title: char.en.title,
        tagline: char.en.tagline,
        description: char.en.description,
        system: char.en.system,
        traits: [...char.en.traits],
      },
      locale: 'en',
      overrideAccess: true,
      context: seedContext,
    })
    console.log(`Character ${char.slug} updated`)
    return
  }

  const doc = await payload.create({
    collection: 'characters',
    data: zhData,
    locale: 'zh-Hans',
    overrideAccess: true,
    context: seedContext,
  })

  await payload.update({
    collection: 'characters',
    id: doc.id,
    data: {
      name: char.en.name,
      title: char.en.title,
      tagline: char.en.tagline,
      description: char.en.description,
      system: char.en.system,
      traits: [...char.en.traits],
    },
    locale: 'en',
    overrideAccess: true,
    context: seedContext,
  })

  console.log(`Created character: ${char.slug} (zh-Hans + en)`)
}

export async function seedCharacters(payload: Payload, siteId: number) {
  for (const char of CHARACTERS) {
    await upsertCharacter(payload, siteId, char)
  }
}
