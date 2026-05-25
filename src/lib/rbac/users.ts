import type { Payload } from 'payload'
import type { PayloadRequest } from 'payload'

import { SYSTEM_ROLE_SLUGS } from '../../access/permissions/catalog'

export async function findRoleIdBySlug(
  payload: Payload,
  slug: string,
): Promise<number | null> {
  const result = await payload.find({
    collection: 'roles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  return result.docs[0]?.id ?? null
}

export async function userHasRoleSlug(
  payload: Payload,
  userId: number,
  roleSlug: string,
): Promise<boolean> {
  const roleId = await findRoleIdBySlug(payload, roleSlug)
  if (!roleId) return false

  const user = await payload.findByID({
    collection: 'users',
    id: userId,
    depth: 1,
    overrideAccess: true,
  })

  return (user.roles ?? []).some((role) => {
    if (typeof role === 'object' && role !== null) {
      return role.slug === roleSlug || role.id === roleId
    }
    return role === roleId
  })
}

export async function countUsersWithRoleSlug(
  req: PayloadRequest,
  roleSlug: string,
): Promise<number> {
  const roleId = await findRoleIdBySlug(req.payload, roleSlug)
  if (!roleId) return 0

  const result = await req.payload.find({
    collection: 'users',
    where: {
      roles: { contains: roleId },
    },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  return result.totalDocs
}

export async function rolesIncludePlatformAdmin(
  req: PayloadRequest,
  roleIds: unknown[] | undefined,
): Promise<boolean> {
  if (!roleIds?.length) return false

  const platformAdminId = await findRoleIdBySlug(
    req.payload,
    SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN,
  )
  if (!platformAdminId) return false

  for (const role of roleIds) {
    const id =
      typeof role === 'object' && role !== null && 'id' in role
        ? Number((role as { id: number }).id)
        : typeof role === 'number'
          ? role
          : null
    if (id === platformAdminId) return true
  }

  return false
}
