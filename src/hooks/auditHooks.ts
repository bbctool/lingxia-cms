import type { CollectionBeforeChangeHook } from 'payload'

type StatusDoc = {
  status?: 'draft' | 'published' | null
  firstPublishedAt?: string | null
}

type VisibleDoc = {
  visible?: boolean | null
  firstPublishedAt?: string | null
}

function applyPublishAudit(
  data: Record<string, unknown>,
  originalDoc: Record<string, unknown> | undefined,
  userId: number,
  isPublishTransition: boolean,
): void {
  if (!isPublishTransition) return

  data.publishedBy = userId

  const previousFirstPublishedAt =
    (originalDoc?.firstPublishedAt as string | null | undefined) ??
    (data.firstPublishedAt as string | null | undefined)

  if (!previousFirstPublishedAt) {
    data.firstPublishedAt = new Date().toISOString()
  }
}

export const setArticleAuthorOnCreate: CollectionBeforeChangeHook = ({
  req,
  data,
  operation,
}) => {
  if (operation === 'create' && req.user?.id && data) {
    data.author = req.user.id
    const displayName = req.user.displayName
    data.authorDisplayName =
      typeof displayName === 'string' && displayName.trim()
        ? displayName.trim()
        : req.user.email
  }
  return data
}

export const auditBeforeChangeStatus: CollectionBeforeChangeHook = ({
  req,
  data,
  operation,
  originalDoc,
}) => {
  if (!req.user?.id || !data) return data

  const userId = req.user.id
  const previous = originalDoc as StatusDoc | undefined
  const previousStatus = previous?.status
  const nextStatus = (data.status as StatusDoc['status']) ?? previousStatus ?? 'draft'

  if (operation === 'create') {
    data.createdBy = userId
  }

  data.updatedBy = userId

  const isPublishTransition =
    nextStatus === 'published' &&
    (operation === 'create' || previousStatus !== 'published')

  applyPublishAudit(data, originalDoc, userId, isPublishTransition)

  return data
}

export const auditBeforeChangeVisible: CollectionBeforeChangeHook = ({
  req,
  data,
  operation,
  originalDoc,
}) => {
  if (!req.user?.id || !data) return data

  const userId = req.user.id
  const previous = originalDoc as VisibleDoc | undefined
  const previousVisible = previous?.visible ?? false
  const nextVisible = (data.visible as boolean | null | undefined) ?? previous?.visible ?? true

  if (operation === 'create') {
    data.createdBy = userId
  }

  data.updatedBy = userId

  const isPublishTransition =
    nextVisible === true &&
    (operation === 'create' || previousVisible !== true)

  applyPublishAudit(data, originalDoc, userId, isPublishTransition)

  return data
}
