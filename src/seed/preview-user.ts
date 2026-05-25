import type { Payload } from 'payload'

import { SYSTEM_ROLE_SLUGS } from '../access/permissions/catalog'
import { findRoleIdBySlug } from '../lib/rbac/users'

export const PREVIEW_USER_EMAIL = 'home-preview@lingxia.local'

export async function seedPreviewUser(
  payload: Payload,
  siteId: number,
): Promise<void> {
  const configuredKey = process.env.HOME_PREVIEW_API_KEY?.trim()
  const apiKey = configuredKey || undefined

  const viewerRoleId = await findRoleIdBySlug(payload, SYSTEM_ROLE_SLUGS.VIEWER)
  if (!viewerRoleId) {
    console.warn('RBAC: viewer role missing; run seedRbac first')
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: PREVIEW_USER_EMAIL } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const userData = {
    roles: [viewerRoleId],
    displayName: 'Home Preview (read-only)',
    sites: [siteId],
    enableAPIKey: true,
    ...(apiKey ? { apiKey } : {}),
  }

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: userData,
      overrideAccess: true,
    })
    console.log(`Preview user ready: ${PREVIEW_USER_EMAIL}`)
    return
  }

  const crypto = await import('crypto')
  await payload.create({
    collection: 'users',
    data: {
      email: PREVIEW_USER_EMAIL,
      password: crypto.randomBytes(32).toString('hex'),
      ...userData,
      apiKey: apiKey ?? crypto.randomBytes(32).toString('hex'),
    },
    overrideAccess: true,
  })

  console.log(`Created preview user: ${PREVIEW_USER_EMAIL}`)
  if (!configuredKey) {
    console.log('Set lingxia_home CONTENT_API_KEY from Admin → Users → API Key')
  }
}
