import $Discussion from '@/components/home/dicussion'
import DiscussionSkeleton from '@/components/home/discussion-skeleton'
import Pagination from '@/components/home/pagination'
import DiscussionLayout from '@/components/layouts/discussion-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { date, to } from '@/lib/date'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function Discussion() {
  const { query, push } = useRouter()

  const { toast } = useToast()

  console.log(
    'query',
    api.useContext().discussion.all.getData({
      page: 1,
      topic: undefined,
    }),
  )
  const {
    data: discussion,
    error,
    isLoading,
  } = api.discussion.find.useQuery(query.slug as string, {
    enabled: !!query.slug,
  })

  useEffect(() => {
    if (error) {
      push('/')

      toast({
        title: 'Discussion not found',
        description: 'The discussion you are looking for does not exist.',
        variant: 'destructive',
      })
    }
  }, [error, push, toast])

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

interface PostProps {
  body: string | null
  id: number
  createdAt: Date
  user?: {
    username: string
    avatar: string | null
  }
}

function Post({ body, user, createdAt }: PostProps) {
  return (
    <div className="flex items-start space-x-3 bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
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
        <div>{body}</div>

        <div>
          Posted{' '}
          <time
            dateTime={createdAt?.toISOString()}
            title={date(createdAt).format('YYYY-MM-DD HH:mm')}
          >
            {to(createdAt).toString()}
          </time>
        </div>
      </div>
    </div>
  )
}

// TODO: UserAvatar Component
// TODO: Post Component
// Rename home to discussions
// Component discussion to discussioncard
// card component shared, pagination shared, navbar share
// loading posts

function Posts() {
  const { query } = useRouter()

  const { data: posts } = api.post.postsByDiscussionId.useQuery(
    {
      slug: query.slug as string,
      page: query.page ? Number(query.page) : 1,
      perPage: 2,
    },
    {
      enabled: !!query.slug,
    },
  )

  return (
    <div className="space-y-6">
      {posts?.data.map((post) => (
        <Post
          id={post.id}
          body={post.body}
          key={post.id}
          createdAt={post.createdAt}
          user={{
            username: post.user?.username ?? '',
            avatar: post.user?.avatar ?? null,
          }}
        />
      ))}
      <Pagination page={posts?.meta.page} totalPages={posts?.meta.totalPages} />
    </div>
  )
}

export default function DiscussionPage() {
  return (
    <DiscussionLayout>
      <Discussion />
      <Posts />
    </DiscussionLayout>
  )
}
