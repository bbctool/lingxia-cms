import type { CollectionConfig } from 'payload'

import { charactersAccess, makePublishFieldAccess } from '../access'
import { auditFields } from '../fields/auditFields'
import { auditBeforeChangeVisible } from '../hooks/auditHooks'
import {
  createAuditLogAfterChangeHook,
  createAuditLogAfterDeleteHook,
} from '../hooks/auditLogHooks'
import { createPublishGuardVisible } from '../hooks/publishGuard'
import {
  revalidateCharacters,
  revalidateCharactersDelete,
} from '../hooks/revalidateSite'
import { livePreviewUrl } from '../lib/previewUrl'

export const Characters: CollectionConfig = {
  slug: 'characters',
  labels: {
    singular: 'Character',
    plural: 'Characters',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sort', 'visible', 'updatedBy'],
    livePreview: {
      url: ({ data, locale }) =>
        livePreviewUrl('characters', data ?? {}, locale),
    },
  },
  access: charactersAccess,
  hooks: {
    beforeChange: [
      createPublishGuardVisible('characters'),
      auditBeforeChangeVisible,
    ],
    afterChange: [revalidateCharacters, createAuditLogAfterChangeHook('characters')],
    afterDelete: [
      revalidateCharactersDelete,
      createAuditLogAfterDeleteHook('characters'),
    ],
  },
  indexes: [
    {
      fields: ['site', 'slug'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Stable id for home animation mapping (e.g. char-1). Not localized.',
      },
    },
    {
      name: 'personaKey',
      type: 'text',
      admin: {
        description:
          'Gateway persona_key for chat (e.g. daozhang, tarot). Not localized.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Subtitle shown under the name',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'system',
      type: 'text',
      localized: true,
      admin: {
        description: 'Wisdom systems label (e.g. Tarot / Astrology)',
      },
    },
    {
      name: 'traits',
      type: 'text',
      hasMany: true,
      localized: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'avatarPath',
      type: 'text',
      admin: {
        description: 'Fallback static path when no media upload (e.g. /Character1_HalfBody.png)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePath',
      type: 'text',
    },
    {
      name: 'bgPath',
      type: 'text',
    },
    {
      name: 'sort',
      type: 'number',
      required: true,
      defaultValue: 100,
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: false,
      access: makePublishFieldAccess('characters'),
    },
    ...auditFields,
  ],
}
