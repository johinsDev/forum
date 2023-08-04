import { cn } from '@/lib/css'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface DiscussionLayoutProps {
  children: React.ReactNode
}

interface FilterNavProps {
  className?: string
  label: string | React.ReactNode
  filter: string
  value?: string
}

const FILTERS = ['no_replies', 'my_discussions', 'participating']

function FilterNav({
  filter,
  label,
  className,
  value = 'true',
}: FilterNavProps) {
  const { query } = useRouter()

  const params = new URLSearchParams(query as any)

  const buildQuery = (key: string, newValue: string) => {
    const params = new URLSearchParams(query as any)

    // remove all filters
    FILTERS.forEach((filter) => {
      params.delete(filter)
    })

    // add new filter
    params.set(key, newValue)

    // remove page
    params.delete('page')

    return params.toString()
  }

  const hasFilter = params.has(filter)

  return (
    <Link
      href={{
        pathname: '/',
        query: buildQuery(filter, value),
      }}
      className={cn('font-medium text-gray-900', className, {
        'font-bold': hasFilter,
      })}
    >
      {label}
    </Link>
  )
}

const DiscussionLayout: FC<DiscussionLayoutProps> = ({ children }) => {
  const { query, pathname } = useRouter()

  const session = useSession()

  const params = new URLSearchParams(query as any)

  const hasFilter = FILTERS.some((filter) => params.has(filter))

  return (
    <div className="grid-cols-7 gap-6 space-y-6 md:grid md:space-y-0">
      <div className="col-span-2 space-y-3 overflow-hidden">
        <nav className="space-y-3 bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={cn('font-medium text-gray-900', {
                  'font-bold': !hasFilter && pathname === '/',
                })}
              >
                All Discussions
              </Link>
            </li>
            <li>
              <FilterNav filter="no_replies" label="No replies" />
            </li>
          </ul>
          {session.status === 'authenticated' && (
            <ul className="space-y-2 border-t border-t-gray-100 pt-3">
              <li>
                <FilterNav filter="my_discussions" label="My discussions" />
              </li>
              <li>
                <FilterNav filter="participating" label="Participating" />
              </li>
            </ul>
          )}
        </nav>
      </div>
      <div className="col-span-5 flex flex-col gap-6 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default DiscussionLayout
