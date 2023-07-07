import { users } from '@/lib/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/trpc'
import { profileSchema } from '@/schemas/user'
import { eq } from 'drizzle-orm'

export const userRouter = createTRPCRouter({
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
