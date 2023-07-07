import { cn } from '@/lib/css'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface NavLinkProps extends LinkProps {
  className?: string
  children: React.ReactNode
}

interface ResponsiveNavLinkProps extends LinkProps {
  className?: string
  children: React.ReactNode
}

export const ResponsiveNavLink: FC<ResponsiveNavLinkProps> = ({
  className,
  children,
  href,
  ...props
}) => {
  const pathName = usePathname()

  const isActive = pathName === href

  return (
    <Link
      href={href}
      className={cn(
        className,
        'block w-full border-l-4 py-2 pl-3 pr-4 text-left text-base font-medium transition duration-150 ease-in-out focus:outline-none',
        {
          'border-indigo-400  bg-indigo-50 text-indigo-700  focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800':
            isActive,
          'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800':
            !isActive,
        }
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export const NavLink: FC<NavLinkProps> = ({
  className,
  children,
  href,
  ...props
}) => {
  const pathName = usePathname()

  const isActive = pathName === href

  return (
    <Link
      href={href}
      className={cn(
        className,
        'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out focus:border-gray-300 focus:text-gray-700 focus:outline-none',
        {
          'border-indigo-400 text-sm font-medium leading-5 text-gray-900  focus:border-indigo-700':
            isActive,
          'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700  focus:border-gray-300 focus:text-gray-700':
            !isActive,
        }
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink
