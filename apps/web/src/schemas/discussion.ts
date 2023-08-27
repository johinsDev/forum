import { discussions } from '@/lib/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const createDiscussionSchema = createInsertSchema(discussions)

export const createDiscussion = createDiscussionSchema.pick({}).merge(
  z.object({
    topicSlug: z.string(),
    body: z.string().min(1),
    title: z.string().min(1).max(255),
  }),
)
