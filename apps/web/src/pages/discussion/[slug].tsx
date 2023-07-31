import Discussion from '@/components/home/dicussion'
import DiscussionSkeleton from '@/components/home/discussion-skeleton'
import DiscussionLayout from '@/components/layouts/discussion-layout'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DiscussionPage() {
  const { query, push } = useRouter()

  const { toast } = useToast()

  const {
    data: discussion,
    error,
    isLoading,
  } = api.discussion.find.useQuery(query.slug as string)

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

  return (
    <DiscussionLayout>
      {isLoading && <DiscussionSkeleton />}

      {!!discussion && <Discussion {...discussion} />}
    </DiscussionLayout>
  )
}
