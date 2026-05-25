/** Permission catalog — keep in sync with seed/rbac.ts */

export const PERMISSION_ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
  'publish',
  'manage',
] as const

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]

export const CONTENT_RESOURCES = [
  'articles',
  'pages',
  'faq-items',
  'characters',
] as const

export type ContentResource = (typeof CONTENT_RESOURCES)[number]

export const PLATFORM_RESOURCES = [
  'media',
  'site-settings',
  'sites',
  'users',
  'roles',
  'audit-logs',
] as const

export type PlatformResource = (typeof PLATFORM_RESOURCES)[number]

export type PermissionResource = ContentResource | PlatformResource

export type PermissionSlug =
  | `${ContentResource}.${PermissionAction}`
  | `${PlatformResource}.${PermissionAction}`

export type PermissionDef = {
  slug: PermissionSlug
  label: string
  resource: PermissionResource
  action: PermissionAction
  description?: string
}

function perm(
  resource: PermissionResource,
  action: PermissionAction,
  label: string,
  description?: string,
): PermissionDef {
  return {
    slug: `${resource}.${action}` as PermissionSlug,
    label,
    resource,
    action,
    description,
  }
}

const contentActions = (
  resource: ContentResource,
  label: string,
): PermissionDef[] => [
  perm(resource, 'read', `${label} — Read`, 'Includes drafts within site scope'),
  perm(resource, 'create', `${label} — Create`),
  perm(resource, 'update', `${label} — Update`, 'Edit content; publish is separate'),
  perm(resource, 'delete', `${label} — Delete`),
  perm(resource, 'publish', `${label} — Publish`, 'Change status / visible to live'),
]

export const PERMISSION_CATALOG: PermissionDef[] = [
  ...contentActions('articles', 'Articles'),
  ...contentActions('pages', 'Pages'),
  ...contentActions('faq-items', 'FAQ'),
  ...contentActions('characters', 'Characters'),
  perm('media', 'read', 'Media — Read'),
  perm('media', 'create', 'Media — Create'),
  perm('media', 'update', 'Media — Update'),
  perm('media', 'delete', 'Media — Delete'),
  perm('site-settings', 'read', 'Site Settings — Read'),
  perm('site-settings', 'update', 'Site Settings — Update'),
  perm('sites', 'read', 'Sites — Read'),
  perm('sites', 'manage', 'Sites — Manage', 'Create/update/delete sites'),
  perm('users', 'read', 'Users — Read'),
  perm('users', 'manage', 'Users — Manage', 'CRUD users, assign roles/sites'),
  perm('roles', 'read', 'Roles — Read'),
  perm('roles', 'manage', 'Roles — Manage', 'Create/update roles and permission bindings'),
  perm('audit-logs', 'read', 'Audit Logs — Read'),
]

export const ALL_PERMISSION_SLUGS: PermissionSlug[] = PERMISSION_CATALOG.map(
  (entry) => entry.slug,
)

/** System role slugs — seed/hooks only; never use in access checks */
export const SYSTEM_ROLE_SLUGS = {
  PLATFORM_ADMIN: 'platform-admin',
  SITE_ADMIN: 'site-admin',
  EDITOR: 'editor',
  CONTRIBUTOR: 'contributor',
  VIEWER: 'viewer',
} as const

/** Maps legacy users.role enum → system role slug (migration only) */
export const LEGACY_ROLE_MAP: Record<string, string> = {
  'super-admin': SYSTEM_ROLE_SLUGS.PLATFORM_ADMIN,
  'site-admin': SYSTEM_ROLE_SLUGS.SITE_ADMIN,
  editor: SYSTEM_ROLE_SLUGS.EDITOR,
  viewer: SYSTEM_ROLE_SLUGS.VIEWER,
}

export const AUTH_CONTEXT_KEY = 'cmsAuthContext'
