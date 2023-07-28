import { date } from '@/lib/date'
import { DbClient } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { slugify } from '@/lib/slug'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const apiTopic = createInsertSchema(topics, {
  title: (s) => s.title.nonempty().max(255).min(3),
})

export const apiCreateTopic = apiTopic.pick({
  title: true,
})

export const apiUpdateTopic = z.object({
  title: z.string().max(255).min(3).optional(),
  id: z.number().positive(),
})

export const apiDeleteTopic = z.object({
  id: z.number().positive(),
})

export const apiOneTopic = z.object({
  id: z.number().positive(),
})

function topicSlug(name: string, db: DbClient, currentId?: number) {
  return slugify(name, db, {
    currentId,
    idColumn: topics.id,
    slugColumn: topics.slug,
    table: topics,
  })
}

export const topicRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.topics.findMany({
      orderBy: (topics, { asc }) => [asc(topics.title)],
    })
  }),
  create: publicProcedure
    .input(apiCreateTopic)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(topics)
        .values({
          title: input.title,
          slug: await topicSlug(input.title, ctx.db),
        })
        .returning()
    }),
  update: publicProcedure
    .input(apiUpdateTopic)
    .mutation(async ({ ctx, input }) => {
      const currentTopic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.id),
      })

      if (!currentTopic) {
        throw new Error('Topic not found')
      }

      return ctx.db
        .update(topics)
        .set({
          title: input.title,
          slug: await topicSlug(
            input.title ?? currentTopic.title,
            ctx.db,
            currentTopic.id,
          ),
          updatedAt: date().toDate(),
        })
        .where(eq(topics.id, currentTopic.id))
        .returning()
    }),
  delete: publicProcedure
    .input(apiDeleteTopic)
    .mutation(async ({ ctx, input }) => {
      const currentTopic = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.id),
      })

      if (!currentTopic) {
        throw new Error('Topic not found')
      }

      return ctx.db
        .delete(topics)
        .where(eq(topics.id, currentTopic.id))
        .returning()
    }),
  find: publicProcedure.input(apiOneTopic).query(async ({ ctx, input }) => {
    const currentTopic = await ctx.db.query.topics.findFirst({
      where: eq(topics.id, input.id),
    })

    if (!currentTopic) {
      throw new Error('Topic not found')
    }

    return currentTopic
  }),
})
