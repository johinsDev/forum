import { DbClient } from '@/lib/db'
import { discussions, posts, users } from '@/lib/db/schema'
import { getMeta, paginationInput } from '@/lib/pagination'
import {
  createInnerTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc/trpc'
import { createPost } from '@/schemas/post'
import { TRPCError } from '@trpc/server'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'

function userCanReply(
  post: Awaited<ReturnType<typeof getQuery>>[0],
  ctx: ReturnType<typeof createInnerTRPCContext>,
) {
  return !!ctx.session?.user
}

function getQuery(db: DbClient) {
  return db
    .select({
      id: posts.id,
      body: posts.body,
      createdAt: posts.createdAt,
      user: {
        id: users.id,
        username: users.username,
        avatar: users.image,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt))
}

export const postsRouter = createTRPCRouter({
  pageOfPost: publicProcedure
    .input(
      paginationInput.merge(
        z.object({
          post: z.number().optional(),
          slug: z.string(),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      let pageOfPost: null | number = null

      const perPage = input.perPage ?? 10

      const discussion = await ctx.db.query.discussions.findFirst({
        columns: {
          id: true,
        },
        where: eq(discussions.slug, input.slug),
      })

      if (!discussion) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Discussion not found',
        })
      }

      if (input.post) {
        const postIndex = await ctx.db
          .select({
            totalRows: sql`COUNT(*)`,
          })
          .from(posts)
          .where(
            and(eq(posts.discussionId, discussion.id), sql`id > ${input.post}`),
          )
          .limit(1)

        pageOfPost = Math.max(
          1,
          Math.ceil(Number(postIndex[0].totalRows) / perPage),
        )
      }

      return pageOfPost
    }),
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
        .where(and(eq(posts.discussionId, discussion.id)))

      const totalRows = Number(count[0].totalRows)

      const meta = await getMeta({
        cursor: input.cursor,
        page: input.page,
        perPage: input.perPage,
        totalRows,
      })

      const rows = await getQuery(ctx.db)
        .where(and(eq(posts.discussionId, discussion.id)))
        .limit(meta.perPage)
        .offset(meta.offset)

      return {
        meta,
        data: rows.map((row) => ({
          ...row,
          userCan: {
            reply: userCanReply(row, ctx),
          },
        })),
      }
    }),
  create: protectedProcedure
    .input(createPost)
    .mutation(async ({ ctx, input }) => {
      if (!userCanReply(null as any, ctx)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to reply',
        })
      }

      const discussion = await ctx.db.query.discussions.findFirst({
        columns: {
          id: true,
        },
        where: eq(discussions.slug, input.discussionSlug),
        with: {
          posts: {
            limit: 1,
            columns: {
              id: true,
            },
            where: isNull(posts.parentId),
          },
        },
      })

      if (!discussion) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Discussion not found',
        })
      }

      const post = await ctx.db
        .insert(posts)
        .values({
          discussionId: discussion.id,
          userId: ctx.session!.user!.id,
          body: input.body,
          parentId: discussion.posts[0]?.id,
        })
        .returning({
          id: posts.id,
        })

      return {
        post: post[0],
      }
    }),
})
