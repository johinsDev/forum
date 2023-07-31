import { FC } from 'react'

interface DiscussionLayoutProps {
  children: React.ReactNode
}

const DiscussionLayout: FC<DiscussionLayoutProps> = ({ children }) => {
  return (
    <div className="grid-cols-7 gap-6 space-y-6 md:grid md:space-y-0">
      <div className="col-span-2 space-y-3 overflow-hidden">
        <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          LEFT
        </div>
      </div>
      <div className="col-span-5 flex flex-col gap-6 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default DiscussionLayout
