import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  localized: true,
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'Overrides page title for search engines when set',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
