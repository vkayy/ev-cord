import type { Metadata } from 'next'
import { Readex_Pro } from 'next/font/google'
import './globals.css'

const font = Readex_Pro({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ev-cord!",
  description: "a messenger app for ev's community",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
