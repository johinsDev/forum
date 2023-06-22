import { buttonVariants } from '@/components/ui/button'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Logo from '../icons/logo'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-white py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Forum
          </p>
        </Link>

        {/* search bar */}

        {/* actions */}
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In {session?.user.username}
        </Link>
      </div>
    </div>
  )
}

export default Navbar
