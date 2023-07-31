import { FC } from 'react'

interface DiscussionSkeletonProps {}

const DiscussionSkeleton: FC<DiscussionSkeletonProps> = ({}) => {
  return (
    <div className="flex h-[76px] animate-pulse items-center justify-between bg-slate-200 px-6 text-center text-lg font-medium shadow-sm sm:rounded-lg">
      <div className="flex flex-grow items-center space-x-3">
        <div className="h-6 w-20 rounded-lg bg-slate-300" />

        <div className="h-6 w-1/5 rounded-lg bg-slate-300" />
      </div>

      <div className="h-6 w-16 rounded-lg bg-slate-300" />
    </div>
  )
}

export default DiscussionSkeleton
