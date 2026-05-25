import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { rolesAccess } from '../access/factories/platformAccess'

export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: {
    singular: 'Role',
    plural: 'Roles',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'allSites', 'isSystem', 'updatedAt'],
    group: 'Platform',
  },
  access: rolesAccess,
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const role = await req.payload.findByID({
          collection: 'roles',
          id,
          depth: 0,
          overrideAccess: true,
        })
        if (role.isSystem) {
          throw new APIError('System roles cannot be deleted', 400)
        }
      },
    ],
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (!originalDoc?.isSystem) return data

        if (data?.slug && data.slug !== originalDoc.slug) {
          throw new APIError('System role slug cannot be changed', 400)
        }

        if (data?.isSystem === false) {
          throw new APIError('System role flag cannot be removed', 400)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stable identifier (e.g. editor, site-admin)',
      },
      access: {
        update: ({ data, siblingData }) => !(data?.isSystem ?? siblingData?.isSystem),
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isSystem',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Built-in roles from seed; slug cannot change',
      },
    },
    {
      name: 'allSites',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, site scope is not restricted for this role',
      },
    },
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      required: true,
      admin: {
        description: 'Permission points granted by this role',
      },
    },
  ],
}
