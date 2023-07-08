import { z } from 'zod'

export const profileSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username is too short',
    })
    .max(50, {
      message: 'Username is too long',
    }),
  name: z.string().max(50, {
    message: 'Name is too long',
  }),
  image: z
    .string()
    .max(250, {
      message: 'Image URL is too long',
    })
    .nullable(),
  email: z
    .string()
    .email({
      message: 'Invalid email',
    })
    .min(2, {
      message: 'Email is too short',
    })
    .max(50, {
      message: 'Email is too long',
    }),
})
