import { api } from '@/utils/api'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export function useDiscussion() {
  const { query } = useRouter()

  const queryData = useQueryClient().getQueriesData([['discussion', 'all']])

  return api.discussion.find.useQuery(query.slug as string, {
    enabled: !!query.slug,
    placeholderData: queryData
      ?.flatMap(([, data]) => (data as any).data)
      ?.find((d: any) => d?.slug === query.slug),
  })
}
