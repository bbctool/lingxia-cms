import type { Block } from 'payload'

export const CharacterCard: Block = {
  slug: 'characterCard',
  labels: {
    singular: 'Character Card',
    plural: 'Character Cards',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'portrait',
      options: [
        { label: 'Portrait (centered image)', value: 'portrait' },
        { label: 'Side by Side', value: 'sideBySide' },
      ],
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'sideBySide',
      },
      options: [
        { label: 'Image Left', value: 'left' },
        { label: 'Image Right', value: 'right' },
      ],
    },
  ],
}
