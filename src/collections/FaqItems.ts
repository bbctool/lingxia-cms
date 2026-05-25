import type { CollectionConfig } from 'payload'

import { faqAccess, makePublishFieldAccess } from '../access'
import { auditFields } from '../fields/auditFields'
import { auditBeforeChangeVisible } from '../hooks/auditHooks'
import {
  createAuditLogAfterChangeHook,
  createAuditLogAfterDeleteHook,
} from '../hooks/auditLogHooks'
import { createPublishGuardVisible } from '../hooks/publishGuard'
import {
  revalidateFaq,
  revalidateFaqDelete,
} from '../hooks/revalidateSite'
import { livePreviewUrl } from '../lib/previewUrl'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'site', 'sort', 'visible', 'updatedBy'],
    livePreview: {
      url: ({ locale }) => livePreviewUrl('faq-items', {}, locale),
    },
  },
  access: faqAccess,
  hooks: {
    beforeChange: [createPublishGuardVisible('faq-items'), auditBeforeChangeVisible],
    afterChange: [revalidateFaq, createAuditLogAfterChangeHook('faq-items')],
    afterDelete: [revalidateFaqDelete, createAuditLogAfterDeleteHook('faq-items')],
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      index: true,
    },
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
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
      access: makePublishFieldAccess('faq-items'),
    },
    ...auditFields,
  ],
}
