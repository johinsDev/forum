import { date } from '@/lib/date'
import { DbClient } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { and, eq, like, not, or } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import slugify from 'slugify'
import { z } from 'zod'

export const apiTopic = createInsertSchema(topics, {
  name: (s) => s.name.nonempty().max(255).min(3),
})

export const apiCreateTopic = apiTopic.pick({
  name: true,
})

export const apiUpdateTopic = z.object({
  name: z.string().max(255).min(3).optional(),
  id: z.number().positive(),
})

export const apiDeleteTopic = z.object({
  id: z.number().positive(),
})

export const apiOneTopic = z.object({
  id: z.number().positive(),
})

const SEPARATOR = '-'

async function topicSlug(name: string, db: DbClient, currentId?: number) {
  const slug = slugify(name, {
    lower: true,
    trim: true,
  })

  const topicsSimilar = await db
    .select({
      slug: topics.slug,
    })
    .from(topics)
    .where(
      and(
        not(eq(topics.id, currentId ?? -1)),
        or(eq(topics.slug, slug), like(topics.slug, `${slug}${SEPARATOR}%`)),
      ),
    )

  const slugs = topicsSimilar.map((topic) => topic.slug)

  if (slugs.length === 0 || !slugs.includes(slug)) {
    return slug
  }

  const len = (slug + SEPARATOR).length

  const max = Math.max(...slugs.map((slug) => Number(slug.slice(len))))

  const suffix = max + 1

  return `${slug}${SEPARATOR}${suffix}`
}

export const topicRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.topics.findMany({
      orderBy: (topics, { asc }) => [asc(topics.name)],
    })
  }),
  create: publicProcedure
    .input(apiCreateTopic)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(topics)
        .values({
          name: input.name,
          slug: await topicSlug(input.name, ctx.db),
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
          name: input.name,
          slug: await topicSlug(
            input.name ?? currentTopic.name,
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
