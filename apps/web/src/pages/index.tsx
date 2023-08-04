import Discussion from '@/components/home/dicussion'
import DiscussionSkeleton from '@/components/home/discussion-skeleton'
import Pagination from '@/components/home/pagination'
import { SelectTopic } from '@/components/home/select-topic'
import DiscussionLayout from '@/components/layouts/discussion-layout'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'

const HomePage = () => {
  const { query } = useRouter()

  const { data, isLoading } = api.discussion.all.useQuery({
    ...query,
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 10,
  })

  const discussions = data?.data ?? []

  const hasDiscussions = discussions.length > 0

  return (
    <DiscussionLayout>
      <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
        <SelectTopic />
      </div>

      {isLoading &&
        new Array(10)
          .fill(0)
          .map((_, index) => <DiscussionSkeleton key={index} />)}

      {!hasDiscussions && !isLoading && (
        <div className="text-gray-90 py-6 text-center text-lg font-medium">
          No discussion found
        </div>
      )}

      {discussions.map((discussion) => (
        <Discussion key={discussion.id} {...discussion} />
      ))}

      {!!hasDiscussions && <Pagination {...data?.meta} />}
    </DiscussionLayout>
  )
}

export default HomePage
