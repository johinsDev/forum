import Logo from '@/components/icons/logo'
import SignInLayout from '@/components/sign-in/sign-in-layout'
import UserAuthForm from '@/components/sign-in/user-auth-form'
import Link from 'next/link'
import { FC } from 'react'

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = ({}) => {
  return (
    <SignInLayout>
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
            className="hover:text-brand font-semibold text-primary"
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </div>
    </SignInLayout>
  )
}

export default SignInPage
