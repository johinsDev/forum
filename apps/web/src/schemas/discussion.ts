import { discussions } from '@/lib/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const createDiscussionSchema = createInsertSchema(discussions)

export const createDiscussion = createDiscussionSchema
  .pick({
    title: true,
    userId: true,
    body: true,
  })
  .merge(z.object({ topicSlug: z.string(), body: z.string() }))
