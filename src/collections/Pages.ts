import type { CollectionConfig } from 'payload'

import { makePublishFieldAccess, pagesAccess } from '../access'
import { pageBlocks } from '../blocks'
import { LOCALE_OPTIONS } from '../config/locales'
import { auditFields } from '../fields/auditFields'
import { campaignPageFields } from '../fields/campaignPageFields'
import { landingPageFields } from '../fields/landingPageFields'
import { seoFields } from '../fields/seoFields'
import { auditBeforeChangeStatus } from '../hooks/auditHooks'
import {
  createAuditLogAfterChangeHook,
  createAuditLogAfterDeleteHook,
} from '../hooks/auditLogHooks'
import { createPublishGuardStatus } from '../hooks/publishGuard'
import {
  revalidatePages,
  revalidatePagesDelete,
} from '../hooks/revalidateSite'
import { livePreviewUrl } from '../lib/previewUrl'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'layout', 'status', 'updatedBy'],
    livePreview: {
      url: ({ data, locale }) => livePreviewUrl('pages', data ?? {}, locale),
    },
  },
  access: pagesAccess,
  hooks: {
    beforeChange: [createPublishGuardStatus('pages'), auditBeforeChangeStatus],
    afterChange: [revalidatePages, createAuditLogAfterChangeHook('pages')],
    afterDelete: [revalidatePagesDelete, createAuditLogAfterDeleteHook('pages')],
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
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Strategy A: stable slug (about, privacy). Not localized.',
      },
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Legal', value: 'legal' },
        { label: 'Landing', value: 'landing' },
        { label: 'Campaign', value: 'campaign' },
      ],
    },
    {
      name: 'body',
      type: 'blocks',
      localized: true,
      blocks: pageBlocks,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout !== 'landing' && siblingData?.layout !== 'campaign',
      },
    },
    ...landingPageFields,
    ...campaignPageFields,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      access: makePublishFieldAccess('pages'),
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'localesPublished',
      type: 'select',
      hasMany: true,
      options: LOCALE_OPTIONS,
    },
    seoFields,
    ...auditFields,
  ],
}
