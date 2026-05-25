import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

type AuditedCollection =
  | 'articles'
  | 'pages'
  | 'faq-items'
  | 'characters'

type AuditedDoc = {
  id: number
  slug?: string | null
  status?: 'draft' | 'published' | null
  visible?: boolean | null
  site?: number | { id: number } | null
}

function resolveSiteId(site: AuditedDoc['site']): number | undefined {
  if (site == null) return undefined
  if (typeof site === 'number') return site
  if (typeof site === 'object' && 'id' in site) return site.id
  return undefined
}

function resolveAuditAction(
  collection: AuditedCollection,
  operation: 'create' | 'update',
  doc: AuditedDoc,
  previousDoc?: AuditedDoc,
): 'create' | 'update' | 'publish' {
  if (collection === 'articles' || collection === 'pages') {
    const nextStatus = doc.status ?? previousDoc?.status
    const prevStatus = previousDoc?.status
    if (
      nextStatus === 'published' &&
      (operation === 'create' || prevStatus !== 'published')
    ) {
      return 'publish'
    }
  }

  if (collection === 'faq-items' || collection === 'characters') {
    const nextVisible = doc.visible ?? previousDoc?.visible ?? true
    const prevVisible = previousDoc?.visible ?? false
    if (
      nextVisible === true &&
      (operation === 'create' || prevVisible !== true)
    ) {
      return 'publish'
    }
  }

  return operation === 'create' ? 'create' : 'update'
}

async function writeAuditLog(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  data: {
    action: 'create' | 'update' | 'delete' | 'publish'
    collection: AuditedCollection
    doc: AuditedDoc
  },
): Promise<void> {
  if (!req.user?.id) return

  await req.payload.create({
    collection: 'audit-logs',
    overrideAccess: true,
    data: {
      user: req.user.id,
      action: data.action,
      collection: data.collection,
      docId: data.doc.id,
      slug: data.doc.slug ?? undefined,
      site: resolveSiteId(data.doc.site),
      at: new Date().toISOString(),
    },
  })
}

export function createAuditLogAfterChangeHook(
  collection: AuditedCollection,
): CollectionAfterChangeHook {
  return async ({ req, doc, operation, previousDoc }) => {
    if (!req.user?.id || !doc) return doc

    const current = doc as AuditedDoc
    const previous = previousDoc as AuditedDoc | undefined

    if (operation === 'create' || operation === 'update') {
      const action = resolveAuditAction(collection, operation, current, previous)
      await writeAuditLog(req, { action, collection, doc: current })
    }

    return doc
  }
}

export function createAuditLogAfterDeleteHook(
  collection: AuditedCollection,
): CollectionAfterDeleteHook {
  return async ({ req, doc }) => {
    if (!req.user?.id || !doc) return

    await writeAuditLog(req, {
      action: 'delete',
      collection,
      doc: doc as AuditedDoc,
    })
  }
}
