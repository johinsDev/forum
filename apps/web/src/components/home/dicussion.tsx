import { date, to } from '@/lib/date'
import Link from 'next/link'
import pluralize from 'pluralize'
import { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type DiscussionProps = {
  title: string
  slug: string
  topic: string | null
  pinnedAt: Date | null
  avatars: { username: string; image: string }[]
  bodyPreview: string | null
  replies: number | null
  lastPost: {
    username: string | null
    updatedAt: Date | null
  } | null
}

const NUM_OF_AVATARS = 3

const Discussion: FC<DiscussionProps> = ({
  title,
  slug,
  topic,
  pinnedAt,
  avatars,
  bodyPreview,
  lastPost,
  replies,
}) => {
  const isPinned = !!pinnedAt
  return (
    <Link
      href={{
        pathname: `/discussion/${slug}`,
        hash: location.hash,
      }}
      className="flex items-start bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg"
    >
      <div className="flex-grow">
        <div className="flex items-center space-x-3">
          {!!topic && (
            <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-0.5 text-sm text-gray-600">
              {topic}
            </span>
          )}

          <h1 className="inline-block items-center text-lg font-medium">
            {isPinned && <span className="mr-2">[Pinned]</span>}
            {title}
          </h1>
        </div>

        {!!bodyPreview && (
          <div className="mt-3 line-clamp-1 text-sm text-gray-500">
            {bodyPreview}
          </div>
        )}

        {!!lastPost && (
          <div className="mt-3 inline-block text-sm">
            Last post by {lastPost?.username || '[User deleted]'}{' '}
            <time
              dateTime={lastPost?.updatedAt?.toISOString()}
              title={date(lastPost?.updatedAt).format('YYYY-MM-DD HH:mm')}
            >
              {to(lastPost?.updatedAt)}
            </time>
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col items-end">
        <div className="flex flex-shrink-0 items-center justify-start -space-x-1 overflow-hidden">
          {avatars?.slice(0, NUM_OF_AVATARS).map((avatar, index) => (
            <Avatar
              className="h-6 w-6 ring-2 ring-white first-of-type:h-7 first-of-type:w-7"
              key={avatar.username + index}
              title={avatar.username}
            >
              <AvatarImage
                src={
                  avatar.image.startsWith('http')
                    ? avatar.image
                    : 'https://pub-0637cd4742424108ae93e8b53807b17a.r2.dev/' +
                      avatar.image
                }
                alt={avatar.username}
                className="object-cover"
              />
              <AvatarFallback className="uppercase">
                {avatar?.username?.[0]}
              </AvatarFallback>
            </Avatar>
          ))}

          {avatars?.length > NUM_OF_AVATARS && (
            <span className="!ml-3 text-sm text-gray-600">
              + {avatars.length - NUM_OF_AVATARS} more
            </span>
          )}
        </div>

        {!!replies && (
          <div className="mt-3 text-sm">
            {replies} {pluralize('reply', replies)}
          </div>
        )}
      </div>
    </Link>
  )
}

export default Discussion
