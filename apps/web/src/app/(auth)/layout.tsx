import { getAuthSession } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { FC } from 'react'

interface LayoutAuthProps {
  children: React.ReactNode
}

const LayoutAuth: FC<LayoutAuthProps> = async ({ children }) => {
  const session = await getAuthSession()

  if (!!session?.user) {
    redirect('/')
  }

  return (
    <div className="flex h-full w-full flex-1">
      <div className="m-auto w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </div>
  )
}

export default LayoutAuth
