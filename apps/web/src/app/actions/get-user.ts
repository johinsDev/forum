import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
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
