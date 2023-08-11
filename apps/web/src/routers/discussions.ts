import { DbClient } from '@/lib/db'
import { discussions, posts, topics, users } from '@/lib/db/schema'
import { getMeta, paginationInput } from '@/lib/pagination'
import { slugify } from '@/lib/slug'
import {
  createInnerTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc/trpc'
import { createDiscussion } from '@/schemas/discussion'
import { TRPCError } from '@trpc/server'
import { SQL, and, asc, desc, eq, isNull, not, sql } from 'drizzle-orm'
import { z } from 'zod'

const discussionsInput = paginationInput.merge(
  z.object({
    topic: z.string().optional().nullable(),
    no_replies: z.enum(['true', 'false']).optional().nullable(),
    my_discussions: z.enum(['true', 'false']).optional().nullable(),
    participating: z.enum(['true', 'false']).optional().nullable(),
    q: z.string().optional().nullable(),
  }),
)

function discussionSlug(name: string, db: DbClient, currentId?: number) {
  return slugify(name, db, {
    currentId,
    idColumn: topics.id,
    slugColumn: topics.slug,
    table: topics,
  })
}

function getQueryDiscussion(
  ctx: ReturnType<typeof createInnerTRPCContext>,
  input?: z.infer<typeof discussionsInput>,
) {
  const noReply = input?.no_replies === 'true'

  const db = ctx.db

  let where: SQL | undefined

  const lastPost = db
    .selectDistinctOn([posts.discussionId], {
      username: users.username,
      discussionId: posts.discussionId,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(() => [desc(posts.discussionId), desc(posts.updatedAt)])
    .as('lastUserPost')

  const firstPost = db
    .selectDistinctOn([posts.discussionId], {
      body: posts.body,
      discussionId: posts.discussionId,
    })
    .from(posts)
    .orderBy(desc(posts.discussionId), asc(posts.createdAt))
    .where(isNull(posts.parentId))
    .as('firstPost')

  const replies = db
    .select({
      discussionId: posts.discussionId,
      count: sql`COUNT(${posts.id})`.as('count'),
    })
    .from(posts)
    .where(not(isNull(posts.parentId)))
    .groupBy(posts.discussionId)
    .as('replies')

  const participant = db
    .select({
      discussionId: posts.discussionId,
    })
    .from(posts)
    .groupBy(posts.discussionId)
    .where(eq(posts.userId, ctx.session?.user.id ?? ''))
    .as('participant')

  if (noReply) {
    where = and(where, isNull(firstPost.discussionId))
  }

  if (!!input?.topic) {
    where = and(where, eq(topics.slug, input.topic))
  }

  if (Boolean(input?.my_discussions) && ctx.session?.user) {
    where = and(where, eq(discussions.userId, ctx.session.user.id))
  }

  if (Boolean(input?.participating) && ctx.session?.user) {
    where = and(where, not(isNull(participant.discussionId)))
  }

  return db
    .select({
      id: discussions.id,
      title: discussions.title,
      slug: discussions.slug,
      pinnedAt: discussions.pinnedAt,
      topic: topics.title,
      bodyPreview: sql`COALESCE(SUBSTRING(${firstPost.body}, 1, 200), '')`.as(
        'bodyPreview',
      ),
      lastPost: {
        username: sql`COALESCE(${lastPost.username}, '')`.as('username'),
        updatedAt: lastPost.updatedAt,
      },
      avatars: sql`
        COALESCE(
          jsonb_agg(
            distinct jsonb_build_object('username', ${users.username}, 'image', ${users.image})) filter (where ${users.image} is not null
          ),
        '[]')`.as('avatars'),
      replies: sql`CAST(COALESCE(${replies.count}, 0) as int)`.as('replies'),
    })
    .from(discussions)
    .leftJoin(participant, eq(discussions.id, participant.discussionId))
    .leftJoin(replies, eq(discussions.id, replies.discussionId))
    .leftJoin(firstPost, eq(discussions.id, firstPost.discussionId))
    .leftJoin(lastPost, eq(discussions.id, lastPost.discussionId))
    .leftJoin(posts, eq(discussions.id, posts.discussionId))
    .leftJoin(users, eq(posts.userId, users.id))
    .leftJoin(topics, eq(discussions.topicId, topics.id))
    .orderBy(
      sql`${discussions.pinnedAt} DESC NULLS LAST,
      COALESCE(${lastPost.updatedAt}, ${discussions.createdAt}) DESC,
      ${discussions.updatedAt} DESC`,
    )
    .groupBy(
      discussions.id,
      topics.title,
      firstPost.body,
      lastPost.username,
      lastPost.updatedAt,
      replies.count,
    )
    .where(where)
}

export const discussionsRouter = createTRPCRouter({
  find: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const rows = await getQueryDiscussion(ctx)
      .where(eq(discussions.slug, input))
      .limit(1)

    type Row = Omit<
      (typeof rows)[0],
      'replies' | 'bodyPreview' | 'avatars' | 'lastPost'
    > & {
      replies: number
      bodyPreview: string
      avatars: { username: string; image: string }[]
      lastPost: {
        username: string
        updatedAt: Date
      }
    }

    const discussion = rows[0] as Row | undefined

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      })
    }

    return discussion
  }),
  all: publicProcedure.input(discussionsInput).query(async ({ ctx, input }) => {
    const query = getQueryDiscussion(ctx, input)

    const totalRows = (await query).length

    const meta = getMeta({
      cursor: input.cursor,
      page: input.page,
      perPage: input.perPage,
      totalRows,
    })

    const rows = await query.limit(meta.limit).offset(meta.offset)

    type Row = Omit<
      (typeof rows)[0],
      'replies' | 'bodyPreview' | 'avatars' | 'lastPost'
    > & {
      replies: number
      bodyPreview: string
      avatars: { username: string; image: string }[]
      lastPost: {
        username: string
        updatedAt: Date
      }
    }

    return {
      data: rows as Row[],
      meta,
    }
  }),
  create: protectedProcedure
    .input(createDiscussion)
    .mutation(async ({ ctx, input }) => {
      const slug = await discussionSlug(input.title, ctx.db)

      const topic = await ctx.db.query.topics.findFirst({
        where: eq(topics.slug, input.topicSlug),
        columns: {
          id: true,
        },
      })

      if (!topic?.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Topic not found',
        })
      }

      return ctx.db
        .insert(discussions)
        .values({
          title: input.title,
          slug,
          topicId: topic.id,
          userId: ctx.session.user.id,
          body: input.body,
        })
        .returning()
    }),
})
