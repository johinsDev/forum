import { cn } from '@/lib/css'
import { figtree } from '@/lib/fonts'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className={cn(figtree.variable)}>
      <Head />
      <body className={cn('flex min-h-screen flex-col bg-gray-100')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
