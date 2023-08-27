import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useRef } from 'react'

interface SelectTopicProps extends React.ComponentProps<typeof Select> {
  children?: React.ReactNode
}

const useSelectInteractionFix = (selectors: string) => {
  const timeoutRef = useRef<number | undefined>()
  const root = document.querySelector<HTMLElement>(selectors)

  if (!root) {
    throw new Error('Root was not found')
  }

  const disableClicks = () => {
    root.style.setProperty('pointer-events', 'none')
  }

  const enableClicks = () => {
    root.style.removeProperty('pointer-events')
    // or root.removeAttribute("style") to remove empty attribute.
  }

  const openChangeHandler = (open: boolean) => {
    if (open) {
      clearTimeout(timeoutRef.current)
      disableClicks()
    } else {
      // Casting it here because Node is returning `Timeout` and this handler will run in the browser.
      timeoutRef.current = setTimeout(enableClicks, 50) as unknown as number
    }
  }

  return openChangeHandler
}

export const SelectTopic = (props: SelectTopicProps) => {
  const { data: topics } = api.topic.all.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const handleOpenChange = useSelectInteractionFix('#__next')

  return (
    <Select
      onValueChange={props.onValueChange}
      value={props.value}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Topic" defaultValue="all" />
      </SelectTrigger>
      <SelectContent>
        {topics?.map((topic) => (
          <SelectItem key={topic.id} value={topic.slug}>
            {topic.title}
          </SelectItem>
        ))}
        {props.children}
      </SelectContent>
    </Select>
  )
}

export const SelectTopicRouter = () => {
  const { push, pathname, query } = useRouter()

  const value = (query.topic ?? 'all') as string

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
    <SelectTopic onValueChange={onValueChange} value={value}>
      <SelectItem value="all">All</SelectItem>
    </SelectTopic>
  )
}
