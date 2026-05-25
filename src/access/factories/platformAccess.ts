import type { Access } from 'payload'
import type { Where } from 'payload'

import { isApiKeyWriteDenied } from '../apiKeyAccess'
import {
  hasPermission,
  requireAnyPermission,
  requirePermission,
  resolveAuthContext,
} from '../permissions'
import { siteScopeWhere } from '../siteScope'

export const permissionsAccess = {
  read: (async ({ req }) => {
    return requireAnyPermission(req, ['roles.read', 'roles.manage', 'users.manage'])
  }) as Access,
  create: (() => false) as Access,
  update: (() => false) as Access,
  delete: (() => false) as Access,
}

export const rolesAccess = {
  read: (async ({ req }) => {
    return requireAnyPermission(req, ['roles.read', 'roles.manage', 'users.manage'])
  }) as Access,
  create: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'roles.manage')
  }) as Access,
  update: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'roles.manage')
  }) as Access,
  delete: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'roles.manage')
  }) as Access,
}

export const usersAccess = {
  read: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'users.manage')
  }) as Access,
  create: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'users.manage')
  }) as Access,
  update: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'users.manage')
  }) as Access,
  delete: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'users.manage')
  }) as Access,
}

export const sitesAccess = {
  read: (async ({ req }) => {
    if (!req.user) return true

    const ctx = await resolveAuthContext(req)
    if (!hasPermission(ctx, 'sites.read') && !hasPermission(ctx, 'sites.manage')) {
      return false
    }

    if (ctx?.allSites) return true

    const siteIds = ctx?.siteIds ?? []
    if (siteIds.length === 0) return false
    return { id: { in: siteIds } } satisfies Where
  }) as Access,
  create: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'sites.manage')
  }) as Access,
  update: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'sites.manage')
  }) as Access,
  delete: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'sites.manage')
  }) as Access,
}

export const auditLogsAccess = {
  read: (async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    return requirePermission(req, 'audit-logs.read')
  }) as Access,
  create: (() => false) as Access,
  update: (() => false) as Access,
  delete: (() => false) as Access,
}
