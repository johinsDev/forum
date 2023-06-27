import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server'

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
