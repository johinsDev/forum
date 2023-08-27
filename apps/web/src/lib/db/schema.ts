import { InferModel, relations } from 'drizzle-orm'
import {
  AnyPgColumn,
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
  'user',
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

export const userRelations = relations(users, ({ many }) => ({
  discussions: many(discussions),
  posts: many(posts),
}))

export const accounts = pgTable(
  'account',
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

export const sessions = pgTable('session', {
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
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (topics) => ({
    slugIdx: uniqueIndex('slug_idx').on(topics.slug),
  }),
)

export const topicsRelations = relations(topics, ({ many }) => ({
  discussions: many(discussions),
}))

export const discussions = pgTable(
  'discussions',
  {
    id: text('id').notNull().primaryKey(),
    userId: text('userId').references(() => users.id, {
      onDelete: 'set null',
    }),
    topicId: integer('topicId').references(() => topics.id),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    pinnedAt: timestamp('pinnedAt', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (discussions) => ({
    slugIdx: uniqueIndex('slug_idx').on(discussions.slug),
  }),
)

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [discussions.topicId],
    references: [topics.id],
  }),
  posts: many(posts),
}))

export const posts = pgTable('posts', {
  id: serial('id').notNull().primaryKey(),
  userId: text('userId').references(() => users.id, {
    onDelete: 'set null',
  }),
  discussionId: text('discussionId').references(() => discussions.id, {
    onDelete: 'cascade',
  }),
  parentId: integer('parentId').references((): AnyPgColumn => posts.id),
  body: text('body'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  discussion: one(discussions, {
    fields: [posts.discussionId],
    references: [discussions.id],
  }),
  reply: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
  }),
}))

export type Session = InferModel<typeof sessions>

export type User = InferModel<typeof users>

export type Account = InferModel<typeof accounts>

export type Topic = InferModel<typeof topics>

export type VerificationToken = InferModel<typeof verificationTokens>

export type Post = InferModel<typeof posts>

export type Discussion = InferModel<typeof discussions>

export const schema = {
  users,
  userRelations,
  accounts,
  sessions,
  verificationTokens,
  topics,
  topicsRelations,
  discussions,
  discussionsRelations,
  posts,
  postsRelations,
}

export type Schema = typeof schema
// resend
// tw-email
// bull
// events

// trpc-rate
// trpc-subscription

// two factor
// link and uinlink
// activate account

// next-translate
// next-seo
// next-pwa
// imgx-image
// commitlint
// lighthouse

// github aciton
// lazy loading dropdown navbar
