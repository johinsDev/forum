import { createTRPCRouter } from '@/lib/trpc/trpc'
import { discussionsRouter } from '@/routers/discussions'
import { postsRouter } from '@/routers/posts'
import { topicRouter } from '@/routers/topic'
import { userRouter } from '@/routers/user'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  topic: topicRouter,
  discussion: discussionsRouter,
  post: postsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
