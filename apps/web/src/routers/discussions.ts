import { DbClient } from '@/lib/db'
import { discussions } from '@/lib/db/schema'
import { getParams, paginationInput } from '@/lib/pagination'
import { slugify } from '@/lib/slug'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc'
import { SQL, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const discussionsInput = paginationInput.merge(
  z.object({
    topic: z.number().optional().nullable(),
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

export const discussionsRouter = createTRPCRouter({
  all: publicProcedure.input(discussionsInput).query(async ({ ctx, input }) => {
    let where: SQL | undefined

    if (input.topic) {
      where = eq(discussions.topicId, input.topic)
    }

    const meta = await getParams({
      db: ctx.db,
      table: discussions,
      cursor: input.cursor,
      page: input.page,
      perPage: input.perPage,
      where,
    })

    const rows = await ctx.db.query.discussions.findMany({
      orderBy: (discussions, { desc }) => [
        sql`${desc(discussions.pinnedAt)} nulls last`,
        desc(discussions.updatedAt),
      ],
      where,
      with: {
        topic: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        pinnedAt: true,
      },
      limit: meta.limit,
      offset: meta.offset,
    })

    return {
      data: rows,
      meta,
    }
  }),
})
