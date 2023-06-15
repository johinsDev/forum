import { auth } from '@/lib/auth'
import Link from 'next/link'

const DashboardTwoPage = async () => {
  console.log('auth.user', auth.user)
  return <Link href="/dashboard">Hi {auth.user?.name}</Link>
}

export default DashboardTwoPage
