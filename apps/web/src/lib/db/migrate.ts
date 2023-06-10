import { neonConfig } from '@neondatabase/serverless'
import 'dotenv/config'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import ws from 'ws'
import { db } from '.'

neonConfig.webSocketConstructor = ws

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  console.log('⏳ Running migrations...')

  const start = Date.now()

  await migrate(db, { migrationsFolder: __dirname + '/migrations' })

  const end = Date.now()

  console.log(`✅ Migrations completed in ${end - start}ms`)

  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed')
  console.error(err)
  process.exit(1)
})
