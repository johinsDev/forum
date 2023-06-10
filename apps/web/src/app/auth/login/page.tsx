import { Metadata } from 'next'
import { getProviders } from 'next-auth/react'
import { LoginForm } from './components/login-form'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function Login() {
  console.log(await getProviders())

  return (
    <section>
      <LoginForm />
    </section>
  )
}
