import { SQL, Subquery } from 'drizzle-orm'
import { AnyPgTable, PgViewBase } from 'drizzle-orm/pg-core'

export type Table = AnyPgTable | Subquery | PgViewBase | SQL
