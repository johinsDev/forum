import Logo from '@/app/icons/logo'
import Link from 'next/link'
import { FC } from 'react'
import UserAuthForm from '../components/user-auth-form'

interface SignUpPageProps {}

export const metadata = {
  title: 'Sign Up',
  description: 'Sign up for an account',
}

const SignUpPage: FC<SignUpPageProps> = ({}) => {
  return (
    <div className="text-center">
      <Logo className="mx-auto mb-6 h-12 w-12" />

      <h1 className="text-3xl font-semibold">Sign up for an account</h1>

      <div className="mt-3 text-stone-400">Welcome to Club! </div>

      <UserAuthForm type="sign-up" />

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          className="hover:text-brand font-semibold text-primary"
          href="/sign-in"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default SignUpPage
