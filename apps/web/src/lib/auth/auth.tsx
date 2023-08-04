import MagicLinkEmail from '@/emails/magic-link'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { GetServerSidePropsContext } from 'next'
import { NextAuthOptions, SessionStrategy, getServerSession } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { schema, users } from '../db/schema'
import { mail } from '../mail/mail'
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

      // TODO: if user comes from google, download the image and upload it to s3

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
