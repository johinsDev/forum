import { sessionGuard } from '@/lib/auth'

async function login() {
  'use server'
  await sessionGuard.loginViaId(1)
}
export default async function HomePage() {
  return (
    <form action={login}>
      <button type="submit">Login</button>
    </form>
  )
}
