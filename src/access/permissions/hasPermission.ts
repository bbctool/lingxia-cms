import type { PayloadRequest } from 'payload'

import type { PermissionSlug } from './catalog'
import { resolveAuthContext } from './resolveUserPerms'
import type { ResolvedAuthContext } from './types'

export function hasPermission(
  ctx: ResolvedAuthContext | null | undefined,
  slug: PermissionSlug,
): boolean {
  return ctx?.permissionSlugs.has(slug) ?? false
}

export function hasAnyPermission(
  ctx: ResolvedAuthContext | null | undefined,
  slugs: PermissionSlug[],
): boolean {
  if (!ctx) return false
  return slugs.some((slug) => ctx.permissionSlugs.has(slug))
}

export async function requirePermission(
  req: PayloadRequest,
  slug: PermissionSlug,
): Promise<boolean> {
  const ctx = await resolveAuthContext(req)
  return hasPermission(ctx, slug)
}

export async function requireAnyPermission(
  req: PayloadRequest,
  slugs: PermissionSlug[],
): Promise<boolean> {
  const ctx = await resolveAuthContext(req)
  return hasAnyPermission(ctx, slugs)
}
