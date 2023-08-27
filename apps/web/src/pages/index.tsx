import DiscussionSkeleton from '@/components/home/discussion-skeleton'
import Pagination from '@/components/home/pagination'
import DiscussionLayout from '@/components/layouts/discussion-layout'
import { buttonVariants } from '@/components/ui/button'
import SkeletonButton from '@/components/ui/skeleton/skeleton-button'
import { api } from '@/utils/api'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SelectTopicRouter = dynamic(
  () =>
    import('@/components/home/select-topic').then(
      (mod) => mod.SelectTopicRouter,
    ),
  {
    ssr: false,
    loading() {
      return <div className="h-10 w-44 animate-pulse rounded-md bg-muted" />
    },
  },
)

const Discussion = dynamic(() => import('@/components/home/dicussion'), {
  ssr: false,
  loading() {
    return <DiscussionSkeleton />
  },
})

const HomePage = () => {
  const { query, pathname } = useRouter()

  const session = useSession()

  const isAuth = session.status === 'authenticated'

  const isLoadingAuth = session.status === 'loading'

  const { data, isLoading } = api.discussion.all.useQuery({
    ...query,
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 10,
  })

  const discussions = data?.data ?? []

  const hasDiscussions = discussions.length > 0

  return (
    <DiscussionLayout
      left={
        <div className="space-y-3">
          {isAuth && (
            <Link
              href={{
                pathname,
                query,
                hash: '#new-discussion',
              }}
              className={buttonVariants({
                full: true,
                size: 'sm',
                className: 'uppercase',
              })}
            >
              Start a discussion
            </Link>
          )}

          {isLoadingAuth && (
            <SkeletonButton full size={'sm'}>
              Start a discussion
            </SkeletonButton>
          )}
        </div>
      }
    >
      <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
        <SelectTopicRouter />
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
