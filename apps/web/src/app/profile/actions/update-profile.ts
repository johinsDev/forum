'use server'
import { getUserThrow } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import dayjs from 'dayjs'
import { and, eq, not } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { profileSchema, profileValues } from '../schemas/profile'

export const updateProfile = async (input: profileValues) => {
  // get user
  const user = await getUserThrow()

  // validate input
  profileSchema.parse(input)

  let userExists = await db.query.users.findFirst({
    where: and(eq(users.email, input.email), not(eq(users.id, user.id))),
  })

  if (userExists) {
    return {
      errors: [
        {
          field: 'email',
          message: 'Email already exists',
        },
      ],
    }
  }

  userExists = await db.query.users.findFirst({
    where: and(eq(users.username, input.username), not(eq(users.id, user.id))),
  })

  if (userExists) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Username already exists',
        },
      ],
    }
  }

  await db
    .update(users)
    .set({
      username: input.username,
      name: input.name,
      email: input.email,
      emailVerified: user?.email === input.email ? dayjs().toDate() : null,
    })
    .where(eq(users.id, user!.id))

  revalidatePath('/profile')
}
