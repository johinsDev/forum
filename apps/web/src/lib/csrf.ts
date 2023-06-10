import csrfEdge from 'edge-csrf'
import { atou, verifyToken } from 'edge-csrf/dist/cjs/util'
import { cookies } from 'next/headers'

export const csrfProtect = csrfEdge({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
})

export function csrf(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  let originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    const formData: FormData = args[0]

    const tokenStr = formData.get('csrf_token') as string

    const secret = cookies().get('_csrfSecret')?.value as string

    if (!(await verifyToken(atou(tokenStr), atou(secret)))) {
      return {
        code: 'csrf',
        error: 'CSRF token invalid',
      }
    }

    let result = originalMethod.apply(this, args)
    return result
  }
}
