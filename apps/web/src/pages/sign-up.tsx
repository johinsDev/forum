import Logo from '@/components/icons/logo'
import UserAuthForm from '@/components/sign-in/user-auth-form'
import Link from 'next/link'
import { FC } from 'react'

interface SignUpPageProps {}

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
