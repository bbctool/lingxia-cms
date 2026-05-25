import type { CollectionConfig } from 'payload'

import { auditLogsAccess } from '../access/auditLogsAccess'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: {
    singular: 'Audit Log',
    plural: 'Audit Logs',
  },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['at', 'action', 'collection', 'docId', 'slug', 'user', 'site'],
    group: 'Platform',
  },
  access: auditLogsAccess,
  timestamps: false,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Publish', value: 'publish' },
      ],
      index: true,
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'docId',
      type: 'number',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      index: true,
    },
    {
      name: 'at',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
