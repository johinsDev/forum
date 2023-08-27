import MagicLinkEmail from '@/emails/magic-link'
import { db } from '@/lib/db'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { GetServerSidePropsContext } from 'next'
import { NextAuthOptions, SessionStrategy, getServerSession } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { users } from '../db/schema'
import { mail } from '../mail/mail'

const strategy: SessionStrategy = 'database'

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy,
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    EmailProvider({
      sendVerificationRequest(params) {
        mail.send((message) => {
          message
            .from(process.env.EMAIL_FROM!)
            .to(params.identifier)
            .subject('Sign in link')
            .react(<MagicLinkEmail url={params.url} />)
        })
      },
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

      session.user.image = dbUser.image
      session.user.id = dbUser.id
      session.user.name = dbUser.name
      session.user.email = dbUser.email
      session.user.username = dbUser.username

      return session
    },
    redirect() {
      return '/'
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

export const getUser = async () => (await getAuthSession())?.user

export const getUserThrow = async () => {
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
