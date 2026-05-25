import type { PermissionSlug } from './catalog'

export type ResolvedAuthContext = {
  permissionSlugs: Set<PermissionSlug>
  allSites: boolean
  siteIds: number[]
}
