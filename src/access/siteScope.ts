import type { Where } from 'payload'

import type { ResolvedAuthContext } from './permissions/types'

export function siteScopeWhere(
  ctx: ResolvedAuthContext | null | undefined,
): true | Where | false {
  if (!ctx) return false
  if (ctx.allSites) return true

  if (ctx.siteIds.length === 0) return false

  return {
    site: { in: ctx.siteIds },
  }
}

export function siteIdAllowed(
  ctx: ResolvedAuthContext | null | undefined,
  site: unknown,
): boolean {
  if (!ctx) return false
  if (ctx.allSites) return true

  const siteId =
    typeof site === 'object' && site !== null && 'id' in site
      ? Number((site as { id: number }).id)
      : typeof site === 'number'
        ? site
        : typeof site === 'string'
          ? Number(site)
          : null

  if (siteId == null || Number.isNaN(siteId)) return false

  return ctx.siteIds.includes(siteId)
}
