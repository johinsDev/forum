import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { ProviderType } from 'next-auth/providers'

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    password: text('password'),
    username: text('username'),
    image: text('image'),
  },
  (user) => {
    return {
      usernameIndex: uniqueIndex('users_username_index').on(user.username),
      emailIndex: uniqueIndex('users_email_index').on(user.email),
    }
  }
)

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<ProviderType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
)

export type Schema = {
  users: typeof users
  accounts: typeof accounts
  sessions: typeof sessions
  verificationTokens: typeof verificationTokens
}
