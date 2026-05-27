import type { AllowList } from 'payload'

function parseAllowListEntry(entry: string): AllowList[number] | null {
  const trimmed = entry.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed)
      const protocol = url.protocol.replace(':', '')
      return {
        hostname: url.hostname,
        protocol: protocol === 'http' ? 'http' : 'https',
      }
    } catch {
      return null
    }
  }

  const hostname = trimmed.replace(/^https?:\/\//, '').split('/')[0]
  if (!hostname) return null

  return {
    hostname,
    protocol: 'https',
  }
}

/** Hostnames allowed for server-side remote URL import in Media uploads. */
export function getMediaPasteUrlAllowList(): AllowList {
  return (
    process.env.MEDIA_PASTE_URL_HOSTS?.split(',')
      .map((entry) => parseAllowListEntry(entry))
      .filter((entry): entry is AllowList[number] => entry !== null) ?? []
  )
}

export function getMediaPasteUrlUploadOptions(): Record<string, unknown> {
  const allowList = getMediaPasteUrlAllowList()
  if (allowList.length === 0) return {}

  return {
    pasteURL: { allowList },
    skipSafeFetch: allowList,
  }
}
