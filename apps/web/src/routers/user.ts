import { IMAGE_MIME_TYPE } from '@/config'
import { users } from '@/lib/db/schema'
import { getSignedUrl } from '@/lib/storage/s3'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/trpc'
import { profileSchema } from '@/schemas/user'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { filetype } = input

      const extension = filetype.split('/')[1]

      const path = ctx.session.user.id + '/' + 'avatar' + '.' + extension

      const url = await getSignedUrl(path, {
        contentType: filetype,
        method: 'PUT',
      })

      return { url, path }
    }),
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      const usersResult = await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id))
        .returning()

      return usersResult[0]
    }),
})
