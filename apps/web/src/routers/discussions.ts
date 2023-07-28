import { DbClient } from '@/lib/db'
import { discussions, topics } from '@/lib/db/schema'
import { getParams, paginationInput } from '@/lib/pagination'
import { slugify } from '@/lib/slug'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { createInsertSchema } from 'drizzle-zod'
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

function discussionSlug(name: string, db: DbClient, currentId?: number) {
  return slugify(name, db, {
    currentId,
    idColumn: discussions.id,
    slugColumn: discussions.slug,
    table: discussions,
  })
}

export const discussionsRouter = createTRPCRouter({
  all: publicProcedure.input(paginationInput).query(async ({ ctx, input }) => {
    const meta = await getParams({
      db: ctx.db,
      table: discussions,
      ...input,
    })

    const rows = await ctx.db.query.discussions.findMany({
      with: {
        topic: true,
      },
      columns: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: (discussions, { asc }) => [asc(discussions.title)],
      limit: meta.limit,
      offset: meta.offset,
    })

    return {
      data: rows,
      meta,
    }
  }),
})
