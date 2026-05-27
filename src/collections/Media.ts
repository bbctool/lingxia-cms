import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { mediaAccess } from '../access'
import { getMediaPasteUrlUploadOptions } from '../lib/mediaPasteUrl'

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)$/i

export const Media: CollectionConfig = {
  slug: 'media',
  access: mediaAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        const filename = typeof data?.filename === 'string' ? data.filename : ''
        const mimeType = typeof data?.mimeType === 'string' ? data.mimeType : ''

        if (
          mimeType.startsWith('text/html') &&
          IMAGE_EXTENSIONS.test(filename)
        ) {
          throw new APIError(
            'Remote URL returned HTML instead of an image. Use a public COS link or upload the file locally.',
            400,
          )
        }
      },
    ],
  },
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
    ...getMediaPasteUrlUploadOptions(),
  },
}
