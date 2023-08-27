import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server'

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
): Promise<Response | undefined> {
  const response = NextResponse.next()

  return response
}
