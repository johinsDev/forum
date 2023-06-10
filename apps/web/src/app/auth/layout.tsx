import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div>
        <Link href="/" passHref>
          <Image
            alt="Forum"
            src={'/next.svg'}
            width="112"
            height="32"
            className="h-8 w-28"
            priority
          />
        </Link>
      </div>
      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
        {children}
      </div>
    </>
  )
}
