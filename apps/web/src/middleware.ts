import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { csrfProtect } from './lib/csrf'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const csrfError = await csrfProtect(request, response)

  if (csrfError) {
    return new NextResponse('invalid csrf token', { status: 403 })
  }

  return response
}
