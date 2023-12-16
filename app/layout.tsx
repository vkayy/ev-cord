import type { Metadata } from 'next'
import { Readex_Pro } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          font.className,
          "bg-white dark:bg-[#313338]"
          )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="ev-cord-theme"
            >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
