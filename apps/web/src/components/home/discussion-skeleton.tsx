import { FC } from 'react'

interface DiscussionSkeletonProps {}

const DiscussionSkeleton: FC<DiscussionSkeletonProps> = ({}) => {
  return (
    <div className="flex animate-pulse items-start justify-between bg-slate-200 p-6 text-center text-lg font-medium shadow-sm sm:rounded-lg">
      <div className="flex flex-grow flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-7 w-20 rounded-lg bg-slate-300" />

          <div className="h-7 w-1/5 rounded-lg bg-slate-300" />
        </div>

        <div className="h-5 w-1/6 rounded-lg bg-slate-300" />

        <div className="h-5 w-3/6 rounded-lg bg-slate-300" />
      </div>

      <div className="flex flex-shrink-0 flex-col items-end">
        <div className="flex items-center -space-x-2">
          {new Array(3).fill(0).map((_, index) => (
            <div
              key={index}
              className="h-7 w-7 rounded-full border border-white bg-slate-300"
            />
          ))}
        </div>

        <div className="mt-3 h-5 w-16 rounded-lg bg-slate-300" />
      </div>
    </div>
  )
}

export default DiscussionSkeleton
