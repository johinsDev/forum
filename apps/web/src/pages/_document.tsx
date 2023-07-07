import { cn } from '@/lib/css'
import { inter } from '@/lib/fonts'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className={cn(
          'flex min-h-screen flex-col bg-gray-100',
          inter.className
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
