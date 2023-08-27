import { useRouter } from 'next/router'

export function useRouterModal(modalId: string) {
  const { asPath, push, replace, pathname, query } = useRouter()

  const open = asPath.split('#')[1] === modalId

  function onOpenChange(open: boolean) {
    if (!open) {
      replace({
        pathname,
        query,
      })
    }

    if (open) {
      push({
        pathname,
        query,
        hash: `#${modalId}`,
      })
    }
  }

  return {
    open,
    onOpenChange,
  }
}
