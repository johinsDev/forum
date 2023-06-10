import { and, eq } from 'drizzle-orm'
import type { Adapter } from 'next-auth/adapters'
import { v4 as uuid } from 'uuid'
import type { DbClient } from './db'
import type { Schema } from './db/schema'

export function PgAdapter(
  client: DbClient,
  { users, sessions, verificationTokens, accounts }: Schema
): Adapter {
  return {
    createUser: async (data) => {
      return client
        .insert(users)
        .values({ ...data, id: uuid() })
        .returning()
        .then((res) => res[0])
    },
    getUser: async (data) => {
      const user = await client.query.users.findFirst({
        where: eq(users.id, data),
      })

      return user ?? null
    },
    getUserByEmail: async (data) => {
      return (
        client
          .select()
          .from(users)
          .where(eq(users.email, data))
          .then((res) => res[0]) ?? null
      )
    },
    createSession: async (data) => {
      return client
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    getSessionAndUser: async (data) => {
      return (
        client
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, data))
          .innerJoin(users, eq(users.id, sessions.userId))
          .then((res) => res[0]) ?? null
      )
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error('No user id.')
      }

      return client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .then((res) => res[0])
    },
    updateSession: async (data) => {
      return client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    linkAccount: async (rawAccount) => {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0])

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account: ReturnType<Adapter['linkAccount']> = {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      }

      return account
    },
    getUserByAccount: async (account) => {
      const user =
        (await client
          .select()
          .from(users)
          .innerJoin(
            accounts,
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider)
            )
          )
          .then((res) => res[0])) ?? null

      if (user) {
        return user.users
      }

      return null
    },
    deleteSession: async (sessionToken) => {
      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
    },
    createVerificationToken: async (token) => {
      return client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0])
    },
    useVerificationToken: async (token) => {
      try {
        return (
          client
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token)
              )
            )
            .returning()
            .then((res) => res[0]) ?? null
        )
      } catch (err) {
        throw new Error('No verification token found.')
      }
    },
    deleteUser: async (id) => {
      await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((res) => res[0])
    },
    unlinkAccount: async (account) => {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )

      return undefined
    },
  }
}
