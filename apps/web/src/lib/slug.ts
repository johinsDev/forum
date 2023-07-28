import { AnyColumn, SQL, Subquery, and, eq, like, not, or } from 'drizzle-orm'
import { AnyPgTable, PgViewBase } from 'drizzle-orm/pg-core'
import slugifyNative from 'slugify'
import { DbClient } from './db'

export interface SlugOptions {
  currentId?: number
  separator?: string
  slugifyOptions?: {
    replacement?: string
    remove?: RegExp
    lower?: boolean
    strict?: boolean
    locale?: string
    trim?: boolean
  }
  slugColumnName?: string
  idColumn: AnyColumn
  slugColumn: AnyColumn
  table: AnyPgTable | Subquery | PgViewBase | SQL
}

export async function slugify(
  value: string,
  db: DbClient,
  options: SlugOptions,
) {
  const {
    currentId = -1,
    separator = '-',
    slugifyOptions,
    idColumn,
    slugColumn,
    table,
    slugColumnName = 'slug',
  } = options

  const slug = slugifyNative(value, {
    lower: true,
    trim: true,
    ...slugifyOptions,
  })

  const topicsSimilar = (await db
    // @ts-ignore
    .select({
      [slugColumnName]: slugColumn,
    })
    .from(table)
    .where(
      and(
        not(eq(idColumn, currentId)),
        or(eq(slugColumn, slug), like(slugColumn, `${slug}${separator}%`)),
      ),
    )) as { [key: string]: string }[]

  const slugs = topicsSimilar.map((topic) => topic.slug)

  if (slugs.length === 0 || !slugs.includes(slug)) {
    return slug
  }

  const len = (slug + separator).length

  const max = Math.max(...slugs.map((slug) => Number(slug.slice(len))))

  const suffix = max + 1

  return `${slug}${separator}${suffix}`
}
