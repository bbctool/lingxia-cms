/** Cookie auth checks Origin against csrf — include tunnel/IP/domain origins for test server. */
export function collectAllowedOrigins(): string[] {
  const origins = new Set<string>()

  const add = (value?: string) => {
    if (!value) return
    for (const part of value.split(',')) {
      const origin = part.trim().replace(/\/$/, '')
      if (origin) origins.add(origin)
    }
  }

  const addHost = (value?: string) => {
    if (!value) return
    for (const part of value.split(',')) {
      const host = part.trim().replace(/\/$/, '')
      if (!host) continue
      if (host.startsWith('http://') || host.startsWith('https://')) {
        add(host)
        continue
      }
      add(`https://${host}`)
      add(`http://${host}`)
    }
  }

  add(process.env.PAYLOAD_PUBLIC_URL)
  add(process.env.HOME_URL)
  add(process.env.PAYLOAD_CSRF_ORIGINS)
  add(process.env.ALLOWED_ORIGINS)
  addHost(process.env.PAYLOAD_CSRF_HOSTS)

  add(
    [
      'http://localhost:9001',
      'http://localhost:9000',
      'http://127.0.0.1:9001',
      'http://127.0.0.1:9000',
      'http://localhost:3001',
      'http://localhost:3000',
    ].join(','),
  )

  return [...origins]
}
