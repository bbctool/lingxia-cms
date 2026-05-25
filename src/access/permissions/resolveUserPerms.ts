import type { PayloadRequest } from 'payload'

import { isApiKeyRequest } from '../apiKeyAccess'
import { AUTH_CONTEXT_KEY, type PermissionSlug } from './catalog'
import type { ResolvedAuthContext } from './types'

type RoleDoc = {
  allSites?: boolean | null
  permissions?: ({ slug: string } | number | string)[] | null
}

type UserWithRoles = {
  id: number
  sites?: ({ id: number } | number)[] | null
  roles?: (RoleDoc | number)[] | null
}

function resolveSiteIds(user: UserWithRoles): number[] {
  if (!user.sites?.length) return []
  return user.sites
    .map((site) => (typeof site === 'object' && site !== null ? site.id : site))
    .filter((id): id is number => typeof id === 'number')
}

function collectPermissionSlugs(roles: RoleDoc[]): Set<PermissionSlug> {
  const slugs = new Set<PermissionSlug>()
  for (const role of roles) {
    for (const permission of role.permissions ?? []) {
      if (typeof permission === 'object' && permission !== null && permission.slug) {
        slugs.add(permission.slug as PermissionSlug)
      }
    }
  }
  return slugs
}

function filterApiKeyReadOnly(slugs: Set<PermissionSlug>): Set<PermissionSlug> {
  const filtered = new Set<PermissionSlug>()
  for (const slug of slugs) {
    if (slug.endsWith('.read')) {
      filtered.add(slug)
    }
  }
  return filtered
}

export async function resolveAuthContext(
  req: PayloadRequest,
): Promise<ResolvedAuthContext | null> {
  const cached = req.context?.[AUTH_CONTEXT_KEY] as ResolvedAuthContext | undefined
  if (cached) return cached

  if (!req.user?.id) return null

  const user = (await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
    depth: 2,
    overrideAccess: true,
  })) as UserWithRoles

  const roleDocs: RoleDoc[] = (user.roles ?? [])
    .map((role) => (typeof role === 'object' && role !== null ? role : null))
    .filter((role): role is RoleDoc => role !== null)

  let permissionSlugs = collectPermissionSlugs(roleDocs)
  const allSites = roleDocs.some((role) => role.allSites === true)

  if (isApiKeyRequest(req)) {
    permissionSlugs = filterApiKeyReadOnly(permissionSlugs)
  }

  const ctx: ResolvedAuthContext = {
    permissionSlugs,
    allSites,
    siteIds: resolveSiteIds(user),
  }

  req.context = req.context ?? {}
  req.context[AUTH_CONTEXT_KEY] = ctx

  return ctx
}

export function clearAuthContextCache(req: PayloadRequest): void {
  if (req.context?.[AUTH_CONTEXT_KEY]) {
    delete req.context[AUTH_CONTEXT_KEY]
  }
}
