import Link from 'next/link'
import type { BeforeListServerProps } from 'payload'

export default function ArticlesAuthorFilter({
  user,
  searchParams,
}: BeforeListServerProps) {
  if (!user?.id) return null

  const mineParam = searchParams?.['where[author][equals]']
  const mineActive = mineParam != null && String(mineParam) === String(user.id)
  const base = '/admin/collections/articles'
  const mineHref = `${base}?where[author][equals]=${user.id}`

  return (
    <nav
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
        fontSize: '14px',
      }}
    >
      <Link
        href={base}
        style={{ fontWeight: mineActive ? 400 : 600, textDecoration: 'none' }}
      >
        All articles
      </Link>
      <Link
        href={mineHref}
        style={{ fontWeight: mineActive ? 600 : 400, textDecoration: 'none' }}
      >
        Mine only
      </Link>
    </nav>
  )
}
