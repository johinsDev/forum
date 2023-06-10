import { Toaster } from '@/components/ui/toaster'
import { figtree } from '@/lib/fonts'
import { Metadata } from 'next'
import './home.css'

export const metadata: Metadata = {
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

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" className={`${figtree.variable}`}>
        <head></head>
        <body
          suppressHydrationWarning={true}
          className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0"
        >
          {children}
          <Toaster />
        </body>
      </html>
    </>
  )
}
