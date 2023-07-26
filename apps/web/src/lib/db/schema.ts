import { InferModel } from 'drizzle-orm'
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { AdapterAccount } from 'next-auth/adapters'
export const users = pgTable(
  'users',
  {
    id: text('id').notNull().primaryKey(),
    name: text('name'),
    email: text('email').notNull(),
    username: text('username'),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
  },
  (users) => {
    return {
      usernameIdx: uniqueIndex('username_idx').on(users.username),
    }
  },
)

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
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
  }),
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
  }),
)

export const topics = pgTable(
  'topics',
  {
    id: serial('id').notNull().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (topics) => ({
    slugIdx: uniqueIndex('slug_idx').on(topics.slug),
  }),
)

export type Session = InferModel<typeof sessions>

export type User = InferModel<typeof users>

export type Account = InferModel<typeof accounts>

export type Topic = InferModel<typeof topics>

export type VerificationToken = InferModel<typeof verificationTokens>

export const schema = { users, accounts, sessions, verificationTokens, topics }

export type Schema = typeof schema
