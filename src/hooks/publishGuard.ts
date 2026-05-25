import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import type { ContentResource } from '../access/permissions/catalog'
import {
  hasPermission,
  resolveAuthContext,
} from '../access/permissions'

/** Local seed / migrations may set this on req.context to skip publish RBAC. */
export const BYPASS_PUBLISH_GUARD = 'bypassPublishGuard'

function shouldBypassPublishGuard(req: Parameters<CollectionBeforeChangeHook>[0]['req']) {
  return req.context?.[BYPASS_PUBLISH_GUARD] === true
}

type StatusDoc = {
  status?: 'draft' | 'published' | null
}

type VisibleDoc = {
  visible?: boolean | null
}

export function createPublishGuardStatus(
  resource: Extract<ContentResource, 'articles' | 'pages'>,
): CollectionBeforeChangeHook {
  return async ({ req, data, operation, originalDoc }) => {
    if (!data) return data
    if (shouldBypassPublishGuard(req)) return data

    const previous = originalDoc as StatusDoc | undefined
    const previousStatus = previous?.status
    const nextStatus = (data.status as StatusDoc['status']) ?? previousStatus ?? 'draft'

    const isPublishTransition =
      nextStatus === 'published' &&
      (operation === 'create' || previousStatus !== 'published')

    if (!isPublishTransition) return data

    const ctx = await resolveAuthContext(req)
    const publishSlug = `${resource}.publish` as const

    if (!hasPermission(ctx, publishSlug)) {
      throw new APIError(`Missing permission: ${publishSlug}`, 403)
    }

    return data
  }
}

export function createPublishGuardVisible(
  resource: Extract<ContentResource, 'faq-items' | 'characters'>,
): CollectionBeforeChangeHook {
  return async ({ req, data, operation, originalDoc }) => {
    if (!data) return data
    if (shouldBypassPublishGuard(req)) return data

    const previous = originalDoc as VisibleDoc | undefined
    const previousVisible = previous?.visible ?? false
    const nextVisible =
      (data.visible as boolean | null | undefined) ?? previous?.visible ?? true

    const isPublishTransition =
      nextVisible === true &&
      (operation === 'create' || previousVisible !== true)

    if (!isPublishTransition) return data

    const ctx = await resolveAuthContext(req)
    const publishSlug = `${resource}.publish` as const

    if (!hasPermission(ctx, publishSlug)) {
      throw new APIError(`Missing permission: ${publishSlug}`, 403)
    }

    return data
  }
}
