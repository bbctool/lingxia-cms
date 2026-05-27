import type { CollectionConfig } from 'payload'

import { articlesAccess, makePublishFieldAccess } from '../access'
import { LOCALE_OPTIONS } from '../config/locales'
import { auditFields } from '../fields/auditFields'
import { seoFields } from '../fields/seoFields'
import { auditBeforeChangeStatus, setArticleAuthorOnCreate } from '../hooks/auditHooks'
import {
  createAuditLogAfterChangeHook,
  createAuditLogAfterDeleteHook,
} from '../hooks/auditLogHooks'
import { createPublishGuardStatus } from '../hooks/publishGuard'
import {
  revalidateArticles,
  revalidateArticlesDelete,
} from '../hooks/revalidateSite'
import { articleLexicalEditor } from '../lib/articleLexicalEditor'
import { livePreviewUrl } from '../lib/previewUrl'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'author', 'updatedBy', 'publishedAt'],
    components: {
      beforeList: ['/components/ArticlesAuthorFilter'],
    },
    livePreview: {
      url: ({ data, locale }) =>
        livePreviewUrl('articles', data ?? {}, locale),
    },
  },
  access: articlesAccess,
  hooks: {
    beforeChange: [
      setArticleAuthorOnCreate,
      createPublishGuardStatus('articles'),
      auditBeforeChangeStatus,
    ],
    afterChange: [revalidateArticles, createAuditLogAfterChangeHook('articles')],
    afterDelete: [revalidateArticlesDelete, createAuditLogAfterDeleteHook('articles')],
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
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        read: ({ req }) => Boolean(req.user),
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'authorDisplayName',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Copied from author display name on create; shown on the public site.',
      },
      access: {
        create: () => false,
        update: () => false,
      },
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
        description:
          'Strategy A: one slug for all locales (e.g. welcome-to-lingxia). Do not change per language.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
      editor: articleLexicalEditor,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      access: makePublishFieldAccess('articles'),
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
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
      admin: {
        description:
          'Locales with complete translations. Web sitemap only includes listed locales.',
      },
    },
    seoFields,
    ...auditFields,
  ],
}
