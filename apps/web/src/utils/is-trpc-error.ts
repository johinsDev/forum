import { AppRouter } from '@/lib/trpc/root'
import { TRPCClientError } from '@trpc/client'

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}

export const isZodError = (cause: any): boolean => {
  return Object.keys(cause?.data?.zodError).length > 0
}
