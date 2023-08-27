import { posts } from '@/lib/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const createPostSchema = createInsertSchema(posts)

export const createPost = z.object({
  discussionSlug: z.string(),
  body: z.string(),
})
