import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authOptions } from '@/lib/auth/auth'
import { ChevronDownIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Logo from '../icons/logo'
import DropdownLogout from './dropdown-logout'
import { HamburgerMenu, ResponsiveNavigation } from './hamburger-menu'
import NavLink from './nav-link'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  const user = session?.user

  const isAuth = !!user

  return (
    <nav className="relative border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Logo className="block h-9 w-auto fill-current text-gray-800" />
              </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <NavLink href="/">Forum</NavLink>
            </div>
          </div>

          {!isAuth && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3" v-if="$page.props.auth.user"></div>
              <div className="hidden h-16 space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <NavLink href="/sign-in">Login</NavLink>
                <NavLink href="/sign-up">Register</NavLink>
              </div>
            </div>
          )}

          {isAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:block">
                {user?.username}

                <ChevronDownIcon className="ml-1 inline-block h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownLogout />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <HamburgerMenu />
        </div>
      </div>

      <ResponsiveNavigation session={session} />
    </nav>
  )
}

export default Navbar
