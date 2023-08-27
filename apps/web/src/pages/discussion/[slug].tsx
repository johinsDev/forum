import $Discussion from '@/components/home/dicussion'
import DiscussionSkeleton from '@/components/home/discussion-skeleton'
import Pagination from '@/components/home/pagination'
import DiscussionLayout from '@/components/layouts/discussion-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import SkeletonButton from '@/components/ui/skeleton/skeleton-button'
import { useDiscussion } from '@/hooks/use-dicussion'
import { useRouterModal } from '@/hooks/use-router-modal'
import { cn } from '@/lib/css'
import { date, to } from '@/lib/date'
import { appRouter } from '@/lib/trpc/root'
import { createTRPCContext } from '@/lib/trpc/trpc'
import { RouterOutputs, api } from '@/utils/api'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import superjson from 'superjson'

const CreatePost = dynamic(
  () => import('@/components/discussion/create-post'),
  {
    ssr: false,
  },
)

function Discussion() {
  const { data: discussion, isLoading } = useDiscussion()

  if (isLoading) return <DiscussionSkeleton />

  if (!discussion) return null

  return (
    <$Discussion
      {...discussion}
      bodyPreview={null}
      lastPost={null}
      replies={null}
    />
  )
}

type PostProps = RouterOutputs['post']['postsByDiscussionId']['data'][0]

function Post({ body, user, createdAt, userCan, id }: PostProps) {
  const { onOpenChange } = useRouterModal('new-post')

  return (
    <div
      id={`post-${id}`}
      className="flex items-start space-x-3 bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg"
    >
      <Avatar className="h-7 w-7 flex-shrink-0">
        {user?.avatar && (
          <>
            <AvatarImage
              src={
                user?.avatar?.startsWith('http')
                  ? user.avatar
                  : 'https://pub-0637cd4742424108ae93e8b53807b17a.r2.dev/' +
                    user?.avatar
              }
              alt={user?.username ?? ''}
              className="object-cover"
            />
            <AvatarFallback className="uppercase">
              {user?.username?.[0]}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="w-full">
        <div>{user?.username || '[User deleted]'}</div>
        <div
          className="ProseMirror py-2"
          dangerouslySetInnerHTML={{ __html: body ?? '' }}
        />

        <div>
          Posted{' '}
          <time
            dateTime={createdAt?.toISOString()}
            title={date(createdAt).format('YYYY-MM-DD HH:mm')}
          >
            {to(createdAt).toString()}
          </time>
        </div>

        {userCan.reply && (
          <ul className="flex-items-center mt-2 space-x-3">
            <li>
              <button
                className={cn(
                  buttonVariants({
                    variant: 'link',
                    uppercase: true,
                    className: 'p-0 text-indigo-500',
                  }),
                )}
                onClick={() => onOpenChange(true)}
              >
                reply
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

function Posts() {
  const { query } = useRouter()

  const { data: posts } = api.post.postsByDiscussionId.useQuery(
    {
      slug: query.slug as string,
      page: query.page ? Number(query.page) : 1,
      perPage: query.perPage ? Number(query.perPage) : 10,
    },
    {
      enabled: !!query.slug,
    },
  )

  useEffect(() => {
    const postId = query.postId

    if (!postId) return

    if (!posts?.data) return

    const post = document.getElementById(`post-${postId}`)

    if (post) {
      setTimeout(() => {
        post.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 250)
    }
  }, [query, posts])

  return (
    <div className="space-y-6">
      {posts?.data.map((post) => <Post key={post.id} {...post} />)}
      <Pagination
        remove={['post']}
        page={posts?.meta.page}
        totalPages={posts?.meta.totalPages}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<
  any,
  {
    slug: string
  }
> = async (ctx) => {
  const slug = ctx.params?.slug!

  const page = ctx.query?.page ? Number(ctx.query.page) : 1

  const perPage = ctx.query?.perPage ? Number(ctx.query.perPage) : 10

  const post = ctx.query?.post ? Number(ctx.query.post) : undefined

  if (!post) {
    try {
      const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: await createTRPCContext(ctx as any),
        transformer: superjson,
      })

      await helpers.discussion.find.fetch(slug)

      return {
        props: {},
      }
    } catch (error) {
      return {
        notFound: true,
        props: {},
      }
    }
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(ctx as any),
    transformer: superjson,
  })

  //TODO: review here, reuse pageOfPost fetch
  try {
    const [pageOfPost] = await Promise.all([
      helpers.post.pageOfPost.fetch({
        slug,
        post,
        perPage,
      }),
      helpers.discussion.find.prefetch(slug),
      helpers.post.pageOfPost.prefetch({
        slug,
        post,
        perPage,
      }),
    ])

    if (!!pageOfPost && pageOfPost.toString() !== page.toString()) {
      return {
        redirect: {
          destination: `/discussion/${slug}?postId=${post}&page=${pageOfPost}`,
          permanent: true,
        },
      }
    }

    return {
      props: {
        trpcState: helpers.dehydrate(),
      },
    }
  } catch (error) {
    return {
      notFound: true,
      props: {},
    }
  }
}

export default function DiscussionPage() {
  const session = useSession()

  const { query, pathname } = useRouter()

  const { data: discussion } = useDiscussion()

  const isLoadingAuth = session.status === 'loading'

  return (
    <DiscussionLayout
      left={
        <div className="space-y-3">
          {discussion?.userCan?.reply && (
            <Link
              href={{
                pathname,
                query,
                hash: '#new-post',
              }}
              className={buttonVariants({
                full: true,
                size: 'sm',
                className: 'uppercase',
              })}
            >
              reply a discussion
            </Link>
          )}

          {isLoadingAuth && !discussion?.userCan?.reply && (
            <SkeletonButton full size={'sm'}>
              Reply a discussion
            </SkeletonButton>
          )}
        </div>
      }
    >
      <Discussion />

      <Posts />

      <CreatePost />
    </DiscussionLayout>
  )
}
