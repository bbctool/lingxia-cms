import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { usersAccess } from '../access/factories/platformAccess'
import { requirePermission } from '../access/permissions'
import {
  countUsersWithRoleSlug,
  rolesIncludePlatformAdmin,
  userHasRoleSlug,
} from '../lib/rbac/users'
import { SYSTEM_ROLE_SLUGS } from '../access/permissions/catalog'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'displayName', 'roles', 'updatedAt'],
  },
  auth: {
    useAPIKey: true,
  },
  access: usersAccess,
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        if (req.user?.id != null && String(req.user.id) === String(id)) {
          throw new APIError('Cannot delete your own account', 400)
        }

        const isPlatformAdmin = await userHasRoleSlug(
          req.payload,
          Number(id),
          SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN,
        )
        if (!isPlatformAdmin) return

        if (
          (await countUsersWithRoleSlug(req, SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN)) <= 1
        ) {
          throw new APIError('Cannot delete the last platform-admin user', 400)
        }
      },
    ],
    beforeChange: [
      async ({ req, data, originalDoc }) => {
        const wasPlatformAdmin =
          originalDoc?.id != null
            ? await userHasRoleSlug(
                req.payload,
                Number(originalDoc.id),
                SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN,
              )
            : false

        if (!wasPlatformAdmin) return data

        const nextRoles = data?.roles ?? originalDoc?.roles
        const willBePlatformAdmin = await rolesIncludePlatformAdmin(req, nextRoles)

        if (willBePlatformAdmin) return data

        if (
          (await countUsersWithRoleSlug(req, SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN)) <= 1
        ) {
          throw new APIError('Cannot remove platform-admin from the last admin user', 400)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: true,
      admin: {
        description: 'One or more roles defining permissions for this user',
      },
      access: {
        update: async ({ req }) => requirePermission(req, 'users.manage'),
      },
    },
    {
      name: 'sites',
      type: 'relationship',
      relationTo: 'sites',
      hasMany: true,
      admin: {
        description:
          'Required when no assigned role has All Sites. Ignored for allSites roles.',
      },
    },
  ],
}
