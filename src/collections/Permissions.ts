import type { CollectionConfig } from 'payload'

import { permissionsAccess } from '../access/factories/platformAccess'
import { PERMISSION_ACTIONS } from '../access/permissions/catalog'

const RESOURCE_OPTIONS = [
  { label: 'Articles', value: 'articles' },
  { label: 'Pages', value: 'pages' },
  { label: 'FAQ', value: 'faq-items' },
  { label: 'Characters', value: 'characters' },
  { label: 'Media', value: 'media' },
  { label: 'Site Settings', value: 'site-settings' },
  { label: 'Sites', value: 'sites' },
  { label: 'Users', value: 'users' },
  { label: 'Roles', value: 'roles' },
  { label: 'Audit Logs', value: 'audit-logs' },
]

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  labels: {
    singular: 'Permission',
    plural: 'Permissions',
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'label', 'resource', 'action'],
    group: 'Platform',
    description: 'Read-only catalog maintained by seed. Assign via Roles.',
  },
  access: permissionsAccess,
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'resource',
      type: 'select',
      required: true,
      options: RESOURCE_OPTIONS,
      admin: { readOnly: true },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: PERMISSION_ACTIONS.map((value) => ({ label: value, value })),
      admin: { readOnly: true },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { readOnly: true },
    },
  ],
}
