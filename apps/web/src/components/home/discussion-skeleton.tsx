import { FC } from 'react'

interface DiscussionSkeletonProps {}

const DiscussionSkeleton: FC<DiscussionSkeletonProps> = ({}) => {
  return (
    <div className="flex min-h-[76px] animate-pulse items-start justify-between bg-slate-200 p-6 px-6 text-center text-lg font-medium shadow-sm sm:rounded-lg">
      <div className="flex flex-grow flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-20 rounded-lg bg-slate-300" />

          <div className="h-6 w-1/5 rounded-lg bg-slate-300" />
        </div>

        <div className="h-4 w-1/6 rounded-lg bg-slate-300" />

        <div className="h-4 w-3/6 rounded-lg bg-slate-300" />
      </div>

      <div className="flex items-center -space-x-2">
        {new Array(3).fill(0).map((_, index) => (
          <div
            key={index}
            className="h-7 w-7 rounded-full border border-white bg-slate-300"
          />
        ))}
      </div>
    </div>
  )
}

export default DiscussionSkeleton
