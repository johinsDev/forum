import { Toaster } from '@/components/ui/toaster'
import { inter } from '@/lib/fonts'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Navbar from './components/navbar'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const csrfToken = headers().get('X-CSRF-Token') || 'missing'

  return {
    other: {
      'x-csrf-token': csrfToken,
    },
    title: {
      default: 'Forum',
      template: `%s - Forum`,
    },
    description: 'Forum clone',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" className={`${inter.variable}`}>
        <head></head>
        <body
          suppressHydrationWarning={true}
          className="flex min-h-screen flex-col bg-gray-100"
        >
          <Navbar />

          <main className="container flex max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </>
  )
}
