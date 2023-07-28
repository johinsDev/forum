import { Discussion as DiscussionNative, Topic } from '@/lib/db/schema'
import Link from 'next/link'
import { FC } from 'react'

type Discussion = DiscussionNative & {
  topic: Pick<Topic, 'id' | 'title' | 'slug'> | null
}

type DiscussionProps = Pick<
  Discussion,
  'id' | 'slug' | 'title' | 'topic' | 'pinnedAt'
>

const Discussion: FC<DiscussionProps> = ({ title, slug, topic, pinnedAt }) => {
  const isPinned = !!pinnedAt

  return (
    <Link
      href={`/discussion/${slug}`}
      className="flex items-center bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg"
    >
      <div className="flex-grow">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-0.5 text-sm text-gray-600">
            {topic?.title}
          </span>
          <h1 className="flex items-center  text-lg font-medium">
            {isPinned && <span className="mr-2">[Pinned]</span>}
            {title}
          </h1>
        </div>
      </div>

      <div>Avatars</div>
    </Link>
  )
}

export default Discussion
