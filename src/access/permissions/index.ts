export {
  PERMISSION_ACTIONS,
  PERMISSION_CATALOG,
  ALL_PERMISSION_SLUGS,
  CONTENT_RESOURCES,
  PLATFORM_RESOURCES,
  SYSTEM_ROLE_SLUGS,
  LEGACY_ROLE_MAP,
  AUTH_CONTEXT_KEY,
  type PermissionAction,
  type PermissionResource,
  type ContentResource,
  type PlatformResource,
  type PermissionSlug,
  type PermissionDef,
} from './catalog'

export type { ResolvedAuthContext } from './types'

export {
  resolveAuthContext,
  clearAuthContextCache,
} from './resolveUserPerms'

export {
  hasPermission,
  hasAnyPermission,
  requirePermission,
  requireAnyPermission,
} from './hasPermission'
