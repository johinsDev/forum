import { discussions, posts, users } from '@/lib/db/schema'
import { getMeta, paginationInput } from '@/lib/pagination'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const postsRouter = createTRPCRouter({
  postsByDiscussionId: publicProcedure
    .input(
      paginationInput.merge(
        z.object({
          slug: z.string(),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const discussionRes = await ctx.db
        .select({
          id: discussions.id,
        })
        .from(discussions)
        .where(eq(discussions.slug, input.slug))
        .limit(1)

      const discussion = discussionRes[0]

      if (!discussion) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Discussion not found',
        })
      }

      const count = await ctx.db
        .select({
          totalRows: sql`COUNT(*)`,
        })
        .from(posts)
        .where(
          and(eq(posts.discussionId, discussion.id), isNull(posts.parentId)),
        )

      const totalRows = Number(count[0].totalRows)

      const meta = await getMeta({
        cursor: input.cursor,
        page: input.page,
        perPage: input.perPage,
        totalRows,
      })

      const reply = alias(posts, 'reply')

      const rows = await ctx.db
        .select({
          id: posts.id,
          body: posts.body,
          createdAt: posts.createdAt,
          user: {
            id: users.id,
            username: users.username,
            avatar: users.image,
          },
          reply: {
            id: reply.id,
            body: reply.body,
            createdAt: reply.createdAt,
          },
        })
        .from(posts)
        .leftJoin(reply, eq(posts.id, reply.parentId))
        .leftJoin(users, eq(posts.userId, users.id))
        .where(
          and(eq(posts.discussionId, discussion.id), isNull(posts.parentId)),
        )
        .orderBy(desc(posts.createdAt))
        .limit(meta.perPage)
        .offset(meta.offset)

      return {
        meta,
        data: rows,
      }
    }),
})
