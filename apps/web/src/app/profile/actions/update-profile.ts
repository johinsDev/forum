'use server'

import { getUserThrow } from '@/lib/auth/auth'
import { validateCsrf } from '@/lib/csrf'
import { toDate } from '@/lib/date'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { limiter } from '@/lib/rate-limit'
import { and, eq, not } from 'drizzle-orm'
import { Session } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { ZodFormattedError } from 'zod'
import { profileValues } from '../schemas/profile'

const uniqueUsername = async (username: string, user: Session['user']) => {
  const usernameExists = await db.query.users.findFirst({
    where: and(eq(users.username, username), not(eq(users.id, user.id))),
  })

  if (usernameExists?.id) {
    return {
      error: {
        username: {
          _errors: ['Username already exists'],
        },
      },
    } as {
      error: ZodFormattedError<profileValues>
    }
  }
}

const uniqueEmail = async (email: string, user: Session['user']) => {
  const emailExists = await db.query.users.findFirst({
    where: and(eq(users.email, email), not(eq(users.id, user.id))),
  })

  if (emailExists?.id) {
    return {
      error: {
        email: {
          _errors: ['Email already exists'],
        },
      },
    } as {
      error: ZodFormattedError<profileValues>
    }
  }
}

export const updateProfile = async (
  input: profileValues
): Promise<{
  error: ZodFormattedError<profileValues>
} | void> => {
  await Promise.all([limiter('update-profile'), validateCsrf(input.csrfToken)])

  const user = await getUserThrow()

  await Promise.all([
    uniqueEmail(input.email, user),
    uniqueUsername(input.username, user),
  ])

  await db
    .update(users)
    .set({
      username: input.username,
      name: input.name,
      email: input.email,
      emailVerified: user?.email === input.email ? toDate() : null,
    })
    .where(eq(users.id, user!.id))

  revalidatePath('/profile')
}
