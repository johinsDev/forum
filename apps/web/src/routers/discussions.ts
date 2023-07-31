import { DbClient } from '@/lib/db'
import { discussions, posts, topics, users } from '@/lib/db/schema'
import { getMeta, paginationInput } from '@/lib/pagination'
import { slugify } from '@/lib/slug'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { SQL, asc, desc, eq, isNull, not, sql } from 'drizzle-orm'
import { z } from 'zod'

const discussionsInput = paginationInput.merge(
  z.object({
    topic: z.string().optional().nullable(),
  }),
)

function discussionSlug(name: string, db: DbClient, currentId?: number) {
  return slugify(name, db, {
    currentId,
    idColumn: discussions.id,
    slugColumn: discussions.slug,
    table: discussions,
  })
}

const SELECT_DISCUSSION = {
  id: discussions.id,
  title: discussions.title,
  slug: discussions.slug,
  pinnedAt: discussions.pinnedAt,
  topic: {
    id: topics.id,
    title: topics.title,
    slug: topics.slug,
  },
}

export const discussionsRouter = createTRPCRouter({
  find: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const row = await ctx.db
      .select(SELECT_DISCUSSION)
      .from(discussions)
      .leftJoin(topics, eq(discussions.topicId, topics.id))
      .where(eq(discussions.slug, input))
      .limit(1)

    const discussion = row[0]

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      })
    }

    return discussion
  }),

  all: publicProcedure.input(discussionsInput).query(async ({ ctx, input }) => {
    let where: SQL | undefined

    if (input.topic) {
      where = eq(topics.slug, input.topic)
    }

    const count = await ctx.db
      .select({
        totalRows: sql`COUNT(*)`,
      })
      .from(discussions)
      .leftJoin(topics, eq(discussions.topicId, topics.id))
      .where(where)

    const totalRows = Number(count[0].totalRows)

    const meta = await getMeta({
      cursor: input.cursor,
      page: input.page,
      perPage: input.perPage,
      totalRows,
    })

    const sqLastUserPosted = ctx.db
      .selectDistinctOn([posts.discussionId], {
        id: users.id,
        username: users.username,
        discussionId: posts.discussionId,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(() => [desc(posts.discussionId), desc(posts.updatedAt)])
      .as('lastUserPost')

    const sqlFirstPost = ctx.db
      .selectDistinctOn([posts.discussionId], {
        body: posts.body,
        discussionId: posts.discussionId,
      })
      .from(posts)
      .orderBy(desc(posts.discussionId), asc(posts.createdAt))
      .where(isNull(posts.parentId))
      .as('firstPost')

    const replies = ctx.db
      .select({
        discussionId: posts.discussionId,
        count: sql`COUNT(${posts.id})`.as('count'),
      })
      .from(posts)
      .where(not(isNull(posts.parentId)))
      .groupBy(posts.discussionId)
      .as('replies')

    const rows = await ctx.db
      .select({
        id: discussions.id,
        title: discussions.title,
        slug: discussions.slug,
        pinnedAt: discussions.pinnedAt,
        topic: topics.slug,
        bodyPreview: sql`SUBSTRING(${sqlFirstPost.body}, 1, 200)`,
        userLastPost: {
          username: sqLastUserPosted.username,
          updatedAt: sqLastUserPosted.updatedAt,
        },
        avatars: sql`json_agg(${users.image})`,
        replies: replies.count,
      })
      .from(discussions)
      .leftJoin(replies, eq(discussions.id, replies.discussionId))
      .leftJoin(sqlFirstPost, eq(discussions.id, sqlFirstPost.discussionId))
      .leftJoin(
        sqLastUserPosted,
        eq(discussions.id, sqLastUserPosted.discussionId),
      )
      .leftJoin(posts, eq(discussions.id, posts.discussionId))
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(topics, eq(discussions.topicId, topics.id))
      .where(where)
      .orderBy(
        sql`${discussions.pinnedAt} DESC NULLS LAST, ${sqLastUserPosted.updatedAt} DESC NULLS LAST`,
      )
      .groupBy(
        discussions.id,
        topics.slug,
        sqlFirstPost.body,
        sqLastUserPosted.username,
        sqLastUserPosted.updatedAt,
        replies.count,
      )
      .limit(meta.limit)
      .offset(meta.offset)

    console.log(rows)

    return {
      data: rows,
      meta,
    }
  }),
})
