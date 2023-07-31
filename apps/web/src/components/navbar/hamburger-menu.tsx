import { cn } from '@/lib/css'
import { atom, useAtom } from 'jotai'
import { Menu } from 'lucide-react'
import { Session } from 'next-auth'
import { FC } from 'react'
import { ResponsiveNavLink } from './nav-link'

interface HamburgerMenuProps {}

interface ResponsiveNavigationProps {
  session: Session | null
}

const showingNavigationDropdownAtom = atom(false)

export const ResponsiveNavigation: FC<ResponsiveNavigationProps> = ({
  session,
}) => {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useAtom(
    showingNavigationDropdownAtom,
  )

  const closeNavigationDropdown = () => {
    setShowingNavigationDropdown(false)
  }

  const user = session?.user

  const isAuth = !!user

  return (
    <div
      className={cn('absolute left-0 right-0 top-16 bg-white sm:hidden', {
        block: showingNavigationDropdown,
        hidden: !showingNavigationDropdown,
      })}
    >
      <div className="space-y-1 pb-3 pt-2">
        <ResponsiveNavLink href="/">Forum</ResponsiveNavLink>
      </div>

      {isAuth && (
        <div className="border-t border-gray-200 pb-1 pt-4">
          <div className="px-4">
            <div className="text-base font-medium text-gray-800">
              {user.username}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {user.email}
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <ResponsiveNavLink
              onClick={closeNavigationDropdown}
              href="/profile"
            >
              Profile
            </ResponsiveNavLink>
            <ResponsiveNavLink href={'/logout'}>Log Out</ResponsiveNavLink>
          </div>
        </div>
      )}

      {!isAuth && (
        <div className="space-y-1 border-t border-gray-200 pb-1 pt-4">
          <ResponsiveNavLink onClick={closeNavigationDropdown} href="/sign-in">
            Login
          </ResponsiveNavLink>
          <ResponsiveNavLink
            onClick={closeNavigationDropdown}
            href={'/sign-up'}
          >
            Register
          </ResponsiveNavLink>
        </div>
      )}
    </div>
  )
}

export const HamburgerMenu: FC<HamburgerMenuProps> = ({}) => {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useAtom(
    showingNavigationDropdownAtom,
  )

  return (
    <div className="-mr-2 flex items-center sm:hidden">
      <button
        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  )
}
