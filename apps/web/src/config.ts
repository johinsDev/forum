export const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

export const APP_URL =
  process.env.APP_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000'
