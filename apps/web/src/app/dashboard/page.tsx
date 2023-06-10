import { InputCsrf } from '@/components/input-csrf'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { atou, verifyToken } from 'edge-csrf/dist/cjs/util'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { FormTestAction } from './_form'

export async function getSession() {
  return await getServerSession(authOptions)
}

async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }
  } catch (error: any) {
    return null
  }
}

async function create(data: any) {
  'use server'

  const user = await getCurrentUser()

  const tokenStr = data['csrf_token'] as string

  const secret = cookies().get('_csrfSecret')?.value as string

  if (!(await verifyToken(atou(tokenStr), atou(secret)))) {
    return {
      code: 'csrf',
      error: 'CSRF token invalid',
    }
  }

  console.log('user', user)
}

const DashboardPage = async () => {
  const currentUser = await getCurrentUser()

  return (
    <FormTestAction onSubmit={create}>
      <InputCsrf />
    </FormTestAction>
  )
}

export default DashboardPage
