import { z } from 'zod'

export const csrfTokenSchema = z.object({
  csrfToken: z.string().optional(),
})
