import type { RevalidatePayload } from './revalidateTags'

export async function postRevalidate(body: RevalidatePayload): Promise<boolean> {
  const url = process.env.REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!url) {
    console.info('[revalidate] REVALIDATE_URL not set, skip', body)
    return false
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-revalidate-secret': secret } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.warn('[revalidate] failed', res.status, await res.text())
      return false
    }

    return true
  } catch (err) {
    console.warn('[revalidate] error', err)
    return false
  }
}
