import { FC } from 'react'

interface LayoutAuthProps {
  children: React.ReactNode
}

const LayoutAuth: FC<LayoutAuthProps> = ({ children }) => {
  return (
    <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
      {children}
    </div>
  )
}

export default LayoutAuth
