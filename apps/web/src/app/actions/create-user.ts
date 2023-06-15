import { csrf } from '@/lib/csrf'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { validation } from '@/lib/validation'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import 'server-only'
import { z } from 'zod'

export const createUserSchema = z
  .object({
    name: z.string().min(3),
    email: z
      .string()
      .email()
      .refine(
        async (email) => {
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          })

          return !user?.id
        },
        {
          message: 'Email already exists',
        }
      ),
    username: z
      .string()
      .min(3)
      .refine(
        async (username) => {
          const user = await db.query.users.findFirst({
            where: eq(users.username, username),
          })

          return !user?.id
        },
        {
          message: 'Username already exists',
        }
      ),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['passwordConfirmation'],
        message: 'The passwords did not match',
      })
    }
  })

export type NewUser = z.infer<typeof createUserSchema>

export type ActionResponse = {
  code: string
  error: string
  errors?: z.ZodIssue[]
} | void

class CreateUserAction {
  @csrf
  @validation(createUserSchema)
  async handle(formData: FormData): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as NewUser

    const hashedPassword = await bcrypt.hash(data.password, 12)

    await db.insert(users).values({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      username: data.username,
    })

    redirect('/auth/login')
  }
}

const createUserAction = new CreateUserAction()

export async function createUser(formData: FormData) {
  'use server'
  return createUserAction.handle(formData)
}
