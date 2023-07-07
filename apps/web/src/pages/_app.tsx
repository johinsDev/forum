import Navbar from '@/components/navbar/navbar'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { api } from '@/utils/api'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className="container flex max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
      <Toaster />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
