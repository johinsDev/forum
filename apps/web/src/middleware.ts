import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server'
import { csrfProtect } from './lib/csrf'

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const response = NextResponse.next()

  await csrfProtect(request, response)

  return response
}
