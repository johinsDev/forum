import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { schema } from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const db = drizzle(pool, {
  schema,
})

export type DbClient = typeof db
