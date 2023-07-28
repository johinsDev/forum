import { topics } from '@/lib/db/schema'
import { createSelectSchema } from 'drizzle-zod'

export const selectTopicSchema = createSelectSchema(topics)
