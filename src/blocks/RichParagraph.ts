import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichParagraph: Block = {
  slug: 'richParagraph',
  labels: {
    singular: 'Rich Paragraph',
    plural: 'Rich Paragraphs',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
  ],
}
