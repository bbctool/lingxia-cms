import type { Access } from 'payload'
import type { Where } from 'payload'

import { isApiKeyWriteDenied } from '../apiKeyAccess'
import type { ContentResource, PermissionSlug } from '../permissions/catalog'
import {
  hasPermission,
  requirePermission,
  resolveAuthContext,
} from '../permissions'
import type { ResolvedAuthContext } from '../permissions/types'
import { siteIdAllowed, siteScopeWhere } from '../siteScope'

function publicReadQuery(resource: ContentResource): Where | boolean {
  switch (resource) {
    case 'articles':
      return {
        status: { equals: 'published' },
        publishedAt: { less_than_equal: new Date().toISOString() },
      }
    case 'pages':
      return { status: { equals: 'published' } }
    case 'faq-items':
      return { visible: { equals: true } }
    case 'characters':
      return { visible: { equals: true } }
    default:
      return false
  }
}

export function makeContentAccess(resource: ContentResource) {
  const readSlug = `${resource}.read` as PermissionSlug
  const createSlug = `${resource}.create` as PermissionSlug
  const updateSlug = `${resource}.update` as PermissionSlug
  const deleteSlug = `${resource}.delete` as PermissionSlug

  const read: Access = async ({ req }) => {
    if (!req.user) {
      return publicReadQuery(resource)
    }

    const ctx = await resolveAuthContext(req)
    if (!hasPermission(ctx, readSlug)) return false

    const scope = siteScopeWhere(ctx)
    if (scope === true) return true
    if (scope === false) return false
    return scope
  }

  const create: Access = async ({ req, data }) => {
    if (isApiKeyWriteDenied(req)) return false
    if (!(await requirePermission(req, createSlug))) return false

    const ctx = await resolveAuthContext(req)
    if (!ctx) return false
    if (ctx.allSites) return true

    return siteIdAllowed(ctx, data?.site)
  }

  const update: Access = async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    if (!(await requirePermission(req, updateSlug))) return false

    const ctx = await resolveAuthContext(req)
    if (!ctx) return false

    const scope = siteScopeWhere(ctx)
    if (scope === true) return true
    if (scope === false) return false
    return scope
  }

  const deleteAccess: Access = async ({ req }) => {
    if (isApiKeyWriteDenied(req)) return false
    if (!(await requirePermission(req, deleteSlug))) return false

    const ctx = await resolveAuthContext(req)
    if (!ctx) return false

    const scope = siteScopeWhere(ctx)
    if (scope === true) return true
    if (scope === false) return false
    return scope
  }

  return {
    read,
    create,
    update,
    delete: deleteAccess,
  }
}

export function makePublishFieldAccess(resource: ContentResource) {
  const publishSlug = `${resource}.publish` as PermissionSlug

  return {
    update: async ({ req }: { req: Parameters<Access>[0]['req'] }) => {
      if (isApiKeyWriteDenied(req)) return false
      return requirePermission(req, publishSlug)
    },
  }
}

export function makeSiteSettingsAccess() {
  return {
    read: (async ({ req }) => {
      if (!req.user) return true

      const ctx = await resolveAuthContext(req)
      if (!hasPermission(ctx, 'site-settings.read')) return false

      const scope = siteScopeWhere(ctx)
      if (scope === true) return true
      if (scope === false) return false
      return scope
    }) as Access,
    create: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      return requirePermission(req, 'site-settings.update')
    }) as Access,
    update: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      if (!(await requirePermission(req, 'site-settings.update'))) return false

      const ctx = await resolveAuthContext(req)
      if (!ctx) return false

      const scope = siteScopeWhere(ctx)
      if (scope === true) return true
      if (scope === false) return false
      return scope
    }) as Access,
    delete: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      if (!(await requirePermission(req, 'site-settings.update'))) return false

      const ctx = await resolveAuthContext(req)
      if (!ctx) return false

      const scope = siteScopeWhere(ctx)
      if (scope === true) return true
      if (scope === false) return false
      return scope
    }) as Access,
  }
}

export function makeMediaAccess() {
  return {
    read: (() => true) as Access,
    create: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      return requirePermission(req, 'media.create')
    }) as Access,
    update: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      return requirePermission(req, 'media.update')
    }) as Access,
    delete: (async ({ req }) => {
      if (isApiKeyWriteDenied(req)) return false
      return requirePermission(req, 'media.delete')
    }) as Access,
  }
}

export type { ResolvedAuthContext }
