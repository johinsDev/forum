import { FC } from 'react'

interface SignInLayoutProps {
  children: React.ReactNode
}

const SignInLayout: FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full flex-1">
      <div className="m-auto w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </div>
  )
}

export default SignInLayout
