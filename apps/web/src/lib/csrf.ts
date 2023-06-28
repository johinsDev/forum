import csrf from 'edge-csrf'
import { atou, verifyToken } from 'edge-csrf/dist/cjs/util'
import { cookies } from 'next/headers'

export const csrfProtect = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
})

export const validateCsrf = async (csrfToken: string | undefined) => {
  const secret = atou(cookies().get('_csrfSecret')?.value ?? '')

  if (!csrfToken) {
    throw new Error('Missing CSRF token')
  }

  try {
    await verifyToken(atou(csrfToken), secret)
  } catch (error) {
    throw new Error('Invalid CSRF token')
  }
}
