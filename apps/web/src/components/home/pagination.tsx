import { cn } from '@/lib/css'
import { PaginationResult } from '@/lib/pagination'
import { ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useRef } from 'react'

interface PaginationProps
  extends Partial<Pick<PaginationResult, 'page' | 'totalPages'>> {}

const NUMBER_PER_SECTION = 5

const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}

function range(start: number, end: number) {
  if (start > end) {
    return []
  }

  return new Array(end - start + 1).fill(0).map((_, index) => index + start)
}

const Pagination: FC<PaginationProps> = (props) => {
  const { pathname, query } = useRouter()

  const currentRefPage = useRef(props.page ?? Number(query.page ?? 1))

  currentRefPage.current = props.page ?? Number(query.page ?? 1)

  const currentPage = currentRefPage.current

  const totalRefPages = useRef(props.totalPages ?? 1)

  if (!isNullish(props.totalPages)) {
    totalRefPages.current = props.totalPages
  }

  const totalPages = totalRefPages.current

  const params = new URLSearchParams(query as Record<string, string>)

  const hasPrevPage = currentPage > 1

  const hasNextPage = currentPage < totalPages

  const sections = Math.ceil(totalPages / NUMBER_PER_SECTION)

  const section = Math.ceil(currentPage / NUMBER_PER_SECTION)

  const pages = range(
    (section - 1) * NUMBER_PER_SECTION + 1,
    Math.min(section * NUMBER_PER_SECTION, totalPages),
  )

  if (totalPages === 1) {
    return null
  }

  return (
    <nav className="relative flex justify-center">
      <Link
        href={{
          pathname,
          query: {
            ...Object.fromEntries(params),
            page: currentPage - 1,
          },
        }}
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600',
          {
            'pointer-events-none opacity-50': !hasPrevPage,
          },
        )}
      >
        <ChevronsLeft className="h-4 w-4" />
        Previous
      </Link>

      {section > 1 && (
        <>
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(params),
                page: 1,
              },
            }}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            1
          </Link>
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(params),
                page: (section - 2) * NUMBER_PER_SECTION + 1,
              },
            }}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Link>
        </>
      )}

      {pages.map((page) => (
        <Link
          href={{
            pathname,
            query: {
              ...Object.fromEntries(params),
              page,
            },
          }}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600',
            {
              'bg-slate-200': currentPage === page,
            },
          )}
          key={page}
        >
          {page}
        </Link>
      ))}

      {section < sections && (
        <>
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(params),
                page: section * NUMBER_PER_SECTION + 1,
              },
            }}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Link>
          <Link
            href={{
              pathname,
              query: {
                ...Object.fromEntries(params),
                page: totalPages,
              },
            }}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600',
          {
            'pointer-events-none opacity-50': !hasNextPage,
          },
        )}
        href={{
          pathname,
          query: {
            ...Object.fromEntries(params),
            page: currentPage + 1,
          },
        }}
      >
        Next
        <ChevronsRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}

export default Pagination
