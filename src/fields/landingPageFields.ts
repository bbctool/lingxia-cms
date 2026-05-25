import type { Field } from 'payload'

const isLanding = (_: unknown, siblingData: { layout?: string }) =>
  siblingData?.layout === 'landing'

export const landingPageFields: Field[] = [
  {
    name: 'hero',
    type: 'group',
    localized: true,
    admin: { condition: isLanding },
    fields: [
      { name: 'headline', type: 'text', required: true },
      { name: 'tagline', type: 'textarea', required: true },
    ],
  },
  {
    name: 'heroSocial',
    type: 'group',
    localized: true,
    admin: { condition: isLanding },
    fields: [{ name: 'dividerText', type: 'text', required: true }],
  },
  {
    name: 'chapterOne',
    type: 'group',
    localized: true,
    admin: { condition: isLanding },
    fields: [
      {
        name: 'showEyebrow',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show chapter eyebrow label on site (e.g. Chapter 01)',
        },
      },
      {
        name: 'showTitle',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show chapter main title on site',
        },
      },
      {
        name: 'showPillarTitle',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show pillar title text below each column image',
        },
      },
      {
        name: 'showPillarBody',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show pillar body text below each column image',
        },
      },
      { name: 'eyebrow', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      {
        name: 'pillars',
        type: 'array',
        required: true,
        minRows: 3,
        maxRows: 3,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'body', type: 'textarea', required: true },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            admin: {
              description: 'Column image (portrait or square recommended)',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'chapterTwo',
    type: 'group',
    localized: true,
    admin: { condition: isLanding },
    fields: [
      {
        name: 'showEyebrow',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show chapter eyebrow label on site (e.g. Chapter 02)',
        },
      },
      {
        name: 'showTitle',
        type: 'checkbox',
        defaultValue: true,
        admin: {
          description: 'Show chapter main title on site',
        },
      },
      { name: 'eyebrow', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      {
        name: 'cards',
        type: 'array',
        required: true,
        fields: [
          { name: 'num', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          { name: 'desc', type: 'textarea', required: true },
          { name: 'dialogueTitle', type: 'text', required: true },
          { name: 'userContent', type: 'textarea', required: true },
          { name: 'aiContent', type: 'textarea', required: true },
          {
            name: 'flipCards',
            type: 'text',
            hasMany: true,
            admin: {
              description: 'Optional flip targets (legacy; not shown on current site)',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'ctaSection',
    type: 'group',
    localized: true,
    admin: { condition: isLanding },
    fields: [
      { name: 'title', type: 'textarea', required: true },
      { name: 'subtitle', type: 'textarea', required: true },
      { name: 'primaryCta', type: 'text', required: true },
      {
        name: 'secondaryCtas',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'url', type: 'text', required: true },
        ],
      },
    ],
  },
]
