import { Ratelimit } from '@upstash/ratelimit' // for deno: see above
import { headers } from 'next/headers'
import { to } from './date'
import { redis } from './redis'

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
})

export const limiter = async (path?: string) => {
  const ip = headers().get('x-forwarded-for') ?? ''

  const { success, reset } = await ratelimit.limit(
    `ratelimit_middleware_${path ?? ''}__${ip}`
  )

  if (!success) {
    throw new Error(`Rate limit exceeded. Try again ${to(new Date(reset))}.`)
  }
}
