import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export type ApiKeyUser = User & { _strategy?: string | null }

/** Payload sets `user._strategy = 'api-key'` for API Key auth. */
export function isApiKeyRequest(req: Pick<PayloadRequest, 'user'>): boolean {
  const user = req.user as ApiKeyUser | null | undefined
  return user?._strategy === 'api-key'
}

/** API Key auth is read-only regardless of user role. */
export function isApiKeyWriteDenied(req: Pick<PayloadRequest, 'user'>): boolean {
  return isApiKeyRequest(req)
}
