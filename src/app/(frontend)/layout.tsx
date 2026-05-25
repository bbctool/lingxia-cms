import React from 'react'

export const metadata = {
  title: '灵虾 CMS',
  description: 'Lingxia content management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
