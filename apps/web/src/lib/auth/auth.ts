import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { NextAuthOptions, SessionStrategy, getServerSession } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { schema, users } from '../db/schema'
import { pgDrizzleAdapter } from './drizzle-pg-adapter'

const strategy: SessionStrategy = 'database'

export const authOptions: NextAuthOptions = {
  adapter: pgDrizzleAdapter(db, schema),
  session: {
    strategy,
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, user.email ?? ''),
      })

      if (!dbUser) {
        return session
      }

      if (!dbUser.username) {
        await db
          .update(users)
          .set({
            username: nanoid(10),
          })
          .where(eq(users.id, dbUser.id))
      }

      session.user.id = dbUser.id
      session.user.name = dbUser.name
      session.user.email = dbUser.email
      session.user.image = dbUser.image
      session.user.username = dbUser.username

      return session
    },
    redirect() {
      return '/'
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)
