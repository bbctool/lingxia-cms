import type { CollectionConfig } from 'payload'

import { mediaAccess } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: mediaAccess,
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: [
      'image/*',
      'image/svg+xml',
      'text/html',
      'application/xhtml+xml',
    ],
    allowRestrictedFileTypes: true,
  },
}
