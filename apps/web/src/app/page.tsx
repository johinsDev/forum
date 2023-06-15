import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function login() {
  'use server'
  // proptect rate limit
  // protect zod
  // protect csrf
  await auth.loginViaId(1)

  redirect('/dashboard')
}
export default async function HomePage() {
  return (
    <form action={login}>
      <button type="submit">Login</button>
    </form>
  )
}
