import type { Payload } from 'payload'

import {
  ALL_PERMISSION_SLUGS,
  LEGACY_ROLE_MAP,
  PERMISSION_CATALOG,
  SYSTEM_ROLE_SLUGS,
  type PermissionSlug,
} from '../access/permissions/catalog'
import { findRoleIdBySlug } from '../lib/rbac/users'

type RolePackage = {
  name: string
  description: string
  allSites: boolean
  isSystem: boolean
  permissions: PermissionSlug[]
}

const ROLE_PACKAGES: Record<string, RolePackage> = {
  [SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN]: {
    name: 'Platform Admin',
    description: 'Full platform access (all permissions, all sites)',
    allSites: true,
    isSystem: true,
    permissions: ALL_PERMISSION_SLUGS,
  },
  [SYSTEM_ROLE_SLUGS.SITE_ADMIN]: {
    name: 'Site Admin',
    description: 'Content + site settings for assigned sites',
    allSites: false,
    isSystem: true,
    permissions: [
      ...contentFull('articles'),
      ...contentFull('pages'),
      ...contentFull('faq-items'),
      ...contentFull('characters'),
      'media.read',
      'media.create',
      'media.update',
      'media.delete',
      'site-settings.read',
      'site-settings.update',
      'sites.read',
    ],
  },
  [SYSTEM_ROLE_SLUGS.EDITOR]: {
    name: 'Editor',
    description: 'Content publish for assigned sites',
    allSites: false,
    isSystem: true,
    permissions: [
      ...contentFull('articles'),
      ...contentFull('pages'),
      ...contentFull('faq-items'),
      ...contentFull('characters'),
      'media.read',
      'media.create',
      'media.update',
      'media.delete',
      'site-settings.read',
    ],
  },
  [SYSTEM_ROLE_SLUGS.CONTRIBUTOR]: {
    name: 'Contributor',
    description: 'Draft content without publish or delete',
    allSites: false,
    isSystem: true,
    permissions: [
      ...contentDraft('articles'),
      ...contentDraft('pages'),
      ...contentDraft('faq-items'),
      ...contentDraft('characters'),
      'media.read',
      'media.create',
      'media.update',
      'site-settings.read',
    ],
  },
  [SYSTEM_ROLE_SLUGS.VIEWER]: {
    name: 'Viewer',
    description: 'Read-only within assigned sites',
    allSites: false,
    isSystem: true,
    permissions: [
      'articles.read',
      'pages.read',
      'faq-items.read',
      'characters.read',
      'media.read',
      'site-settings.read',
    ],
  },
}

function contentFull(
  resource: 'articles' | 'pages' | 'faq-items' | 'characters',
): PermissionSlug[] {
  return [
    `${resource}.read`,
    `${resource}.create`,
    `${resource}.update`,
    `${resource}.delete`,
    `${resource}.publish`,
  ]
}

function contentDraft(
  resource: 'articles' | 'pages' | 'faq-items' | 'characters',
): PermissionSlug[] {
  return [`${resource}.read`, `${resource}.create`, `${resource}.update`]
}

async function upsertPermissions(payload: Payload): Promise<Map<string, number>> {
  const slugToId = new Map<string, number>()

  for (const def of PERMISSION_CATALOG) {
    const existing = await payload.find({
      collection: 'permissions',
      where: { slug: { equals: def.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'permissions',
        id: existing.docs[0].id,
        data: {
          label: def.label,
          resource: def.resource,
          action: def.action,
          description: def.description,
        },
        overrideAccess: true,
      })
      slugToId.set(def.slug, existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'permissions',
        data: {
          slug: def.slug,
          label: def.label,
          resource: def.resource,
          action: def.action,
          description: def.description,
        },
        overrideAccess: true,
      })
      slugToId.set(def.slug, created.id)
    }
  }

  console.log(`RBAC: ${slugToId.size} permissions synced`)
  return slugToId
}

async function upsertRoles(
  payload: Payload,
  slugToId: Map<string, number>,
): Promise<void> {
  for (const [slug, pkg] of Object.entries(ROLE_PACKAGES)) {
    const permissionIds = pkg.permissions
      .map((permSlug) => slugToId.get(permSlug))
      .filter((id): id is number => typeof id === 'number')

    const existing = await payload.find({
      collection: 'roles',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const data = {
      slug,
      name: pkg.name,
      description: pkg.description,
      allSites: pkg.allSites,
      isSystem: pkg.isSystem,
      permissions: permissionIds,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'roles',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'roles',
        data,
        overrideAccess: true,
      })
    }
  }

  console.log(`RBAC: ${Object.keys(ROLE_PACKAGES).length} system roles synced`)
}

type LegacyUser = {
  id: number
  email: string
  role?: string | null
  roles?: unknown[] | null
}

async function loadLegacyUserRoles(payload: Payload): Promise<Map<number, string>> {
  const map = new Map<number, string>()
  try {
    const result = await payload.db.drizzle.execute(
      `SELECT id, role::text AS role FROM users WHERE role IS NOT NULL`,
    )
    const rows =
      (result as unknown as { rows?: { id: unknown; role: unknown }[] }).rows ??
      (result as unknown as { id: unknown; role: unknown }[])
    for (const row of rows) {
      map.set(Number(row.id), String(row.role))
    }
  } catch {
    // Legacy column may already be dropped
  }
  return map
}

async function migrateUserRoles(payload: Payload): Promise<void> {
  const legacyRoles = await loadLegacyUserRoles(payload)
  const users = await payload.find({
    collection: 'users',
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  let migrated = 0

  for (const user of users.docs as LegacyUser[]) {
    if (user.roles?.length) continue

    const legacyRole = legacyRoles.get(user.id)
    const roleSlug =
      (legacyRole && LEGACY_ROLE_MAP[legacyRole]) || SYSTEM_ROLE_SLUGS.VIEWER

    const roleId = await findRoleIdBySlug(payload, roleSlug)
    if (!roleId) {
      console.warn(`RBAC: role ${roleSlug} not found for user ${user.email}`)
      continue
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { roles: [roleId] },
      overrideAccess: true,
    })
    migrated++
  }

  // Ensure at least one platform-admin exists
  const platformAdminId = await findRoleIdBySlug(
    payload,
    SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN,
  )
  if (platformAdminId) {
    const admins = await payload.find({
      collection: 'users',
      where: { roles: { contains: platformAdminId } },
      limit: 1,
      overrideAccess: true,
    })

    if (admins.docs.length === 0 && users.docs[0]) {
      await payload.update({
        collection: 'users',
        id: users.docs[0].id,
        data: { roles: [platformAdminId] },
        overrideAccess: true,
      })
      console.log(`RBAC: promoted first user to platform-admin`)
    }
  }

  console.log(`RBAC: migrated ${migrated} user(s) to roles relationship`)
}

export async function seedRbac(payload: Payload): Promise<void> {
  const slugToId = await upsertPermissions(payload)
  await upsertRoles(payload, slugToId)
  await migrateUserRoles(payload)
  await dropLegacyRoleColumn(payload)
}

async function dropLegacyRoleColumn(payload: Payload): Promise<void> {
  try {
    await payload.db.drizzle.execute(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "role";`,
    )
    await payload.db.drizzle.execute(
      `DROP TYPE IF EXISTS "public"."enum_users_role";`,
    )
    console.log('RBAC: dropped legacy users.role column')
  } catch {
    // Column may already be removed by push/migration
  }
}
