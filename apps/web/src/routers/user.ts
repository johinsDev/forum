import { IMAGE_MIME_TYPE } from '@/config'
import { users } from '@/lib/db/schema'
import { getSignedUrl } from '@/lib/storage/s3'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc/trpc'
import { profileSchema } from '@/schemas/user'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

function extractPathFromUrl(url: string | null) {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    return urlObj.pathname.replace(/^\//, '')
  } catch (e) {
    return null
  }
}

export const userRouter = createTRPCRouter({
  allUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany()
  }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(users).where(eq(users.id, ctx.session.user.id))
    return true
  }),
  getPutSignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1).max(100),
        filetype: z
          .string()
          .min(1)
          .max(100)
          .regex(new RegExp(IMAGE_MIME_TYPE.join('|')), {
            message: 'Invalid file type',
          }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { filetype } = input

      const extension = filetype.split('/')[1]

      const path = ctx.session.user.id + '/' + 'avatar' + '.' + extension

      const [putUrl, getUrl] = await Promise.all([
        getSignedUrl(path, {
          contentType: filetype,
          method: 'PUT',
        }),
        getSignedUrl(path, {
          method: 'GET',
        }),
      ])

      return { putUrl, path, getUrl }
    }),
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      const imageUrl = input.image

      const usersResult = await ctx.db
        .update(users)
        .set({
          ...input,
          image: extractPathFromUrl(imageUrl),
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning()

      return usersResult[0]
    }),
})
