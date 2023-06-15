import { auth } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const DashboardPage = async () => {
  await auth.check()

  if (!auth.isAuthenticated) {
    return redirect('/')
  }

  return <Link href={'/dashboard-2'}>Hi {auth.user?.name}</Link>
}

export default DashboardPage
