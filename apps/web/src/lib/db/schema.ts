import { InferModel, relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
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

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export const sessions = pgTable('sessions', {
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().primaryKey(),
  expired_at: timestamp('expired_at', { mode: 'date' }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users),
}))

export type Session = InferModel<typeof sessions>

export type User = InferModel<typeof users>

export type Schema = {
  users: typeof users
  sessions: typeof sessions
}
