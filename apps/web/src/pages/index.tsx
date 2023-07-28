import Discussion from '@/components/home/dicussion'
import Pagination from '@/components/home/pagination'
import { SelectTopic } from '@/components/home/select-topic'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'

const HomePage = () => {
  const { query } = useRouter()

  const topic = query.topic ? Number(query.topic) : undefined

  const { data, isLoading } = api.discussion.all.useQuery({
    page: query.page ? Number(query.page) : 1,
    topic,
  })

  const discussions = data?.data ?? []

  const hasDiscussions = discussions.length > 0

  return (
    <div className="grid-cols-7 gap-6 space-y-6 md:grid md:space-y-0">
      <div className="col-span-2 space-y-3 overflow-hidden">
        <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          LEFT
        </div>
      </div>
      <div className="col-span-5 flex flex-col gap-6 overflow-hidden">
        <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          <SelectTopic />
        </div>

        {isLoading &&
          new Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-[76px] animate-pulse bg-slate-200 text-center text-lg font-medium shadow-sm sm:rounded-lg"
              />
            ))}

        {!hasDiscussions && !isLoading && (
          <div className="text-gray-90 py-6 text-center text-lg font-medium">
            No discussion found
          </div>
        )}

        {discussions.map((discussion) => (
          <Discussion key={discussion.id} {...discussion} />
        ))}

        {!!hasDiscussions && <Pagination {...data?.meta} />}
      </div>
    </div>
  )
}

export default HomePage
