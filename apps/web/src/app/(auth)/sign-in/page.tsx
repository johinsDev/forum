import Logo from '@/app/icons/logo'
import Link from 'next/link'
import { FC } from 'react'
import UserAuthForm from '../components/user-auth-form'

interface SignInPageProps {}

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

const SignInPage: FC<SignInPageProps> = ({}) => {
  return (
    <div className="text-center">
      <Logo className="mx-auto mb-6 h-12 w-12" />

      <h1 className="text-3xl font-semibold">Log in to your account</h1>

      <div className="mt-3 text-stone-400">
        {' '}
        Welcome back! Please enter your details.
      </div>

      <UserAuthForm type="sign-in" />

      <div className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <Link
          className="hover:text-brand text-primary font-semibold"
          href="/sign-up"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default SignInPage
