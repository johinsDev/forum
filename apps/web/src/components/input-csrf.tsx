import { headers } from 'next/headers'

export const InputCsrf = ({ name = 'csrf_token' }) => {
  const csrfToken = headers().get('X-CSRF-Token') || 'missing'

  return <input type="hidden" name={name} value={csrfToken} />
}
