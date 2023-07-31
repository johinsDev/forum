import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { memo } from 'react'

const SelectTopic_ = () => {
  const { push, pathname, query } = useRouter()

  const value = (query.topic ?? 'all') as string

  const { data: topics } = api.topic.all.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(query as any)

    if (value === 'all') {
      params.delete('topic')
    }

    if (value !== 'all') {
      params.set('topic', value)
    }

    push({
      pathname,
      query: params.toString(),
    })
  }

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Topic" defaultValue="all" />
      </SelectTrigger>
      <SelectContent>
        {topics?.map((topic) => (
          <SelectItem key={topic.id} value={topic.slug}>
            {topic.title}
          </SelectItem>
        ))}
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const SelectTopic = memo(SelectTopic_)
