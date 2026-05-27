import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const MediaTextRow: Block = {
  slug: 'mediaTextRow',
  labels: {
    singular: 'Media Text Row',
    plural: 'Media Text Rows',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'text',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image Left', value: 'left' },
        { label: 'Image Right', value: 'right' },
      ],
    },
  ],
}
