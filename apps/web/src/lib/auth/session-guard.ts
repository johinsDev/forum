import { APP_URL, SESSION_SECRET } from '@/config'
import parseUrl from '@/utils/parse-url'
import { base64, string } from '@poppinss/utils/build/helpers'
import { GuardContract, ProviderUserContract } from 'Auth'
import signature from 'cookie-signature'
import { createHash } from 'crypto'
import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { db } from '../db'
import { User, sessions, users } from '../db/schema'

type SessionGuardConfig = {
  driver: 'session'
}

class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User) {}

  getUserFor() {
    return this.user
  }

  getId() {
    return this.user.id
  }
}

export class SessionGuard implements GuardContract {
  isLoggedOut: boolean = true

  isAuthenticated: boolean = false

  user?: ProviderUserContract<User>

  /**
   * Length of the raw token. The hash length will vary
   */
  private tokenLength = 60

  constructor(public name: string, public config: SessionGuardConfig) {}
  /**
   * The name of the session key name
   */
  public get sessionKeyName() {
    return `auth_${this.name}`
  }

  /**
   * Converts value to a sha256 hash
   */
  private generateHash(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  /**
   * Marks user as logged-in
   */
  protected markUserAsLoggedIn(user: any, authenticated?: boolean) {
    this.user = user
    this.isLoggedOut = false
    authenticated && (this.isAuthenticated = true)
  }

  /**
   * Generates a new token + hash for the persistance
   */
  private generateTokenForPersistance(expiresIn?: string | number) {
    // generate random token
    const token = string.generateRandom(this.tokenLength)

    return {
      token,
      hash: this.generateHash(token),
    }
  }

  protected async setSession(userId: number) {
    const token = this.generateTokenForPersistance()

    const expiredAt = dayjs().add(30, 'day').toDate()

    const session = await db
      .insert(sessions)
      .values({
        sessionToken: token.hash,
        expired_at: expiredAt,
        userId,
      })
      .returning()

    const sessionId = session[0].id

    cookies().set(
      this.sessionKeyName,
      signature.sign(
        base64.urlEncode(`${sessionId}.${token.token}`),
        SESSION_SECRET
      ),
      {
        httpOnly: true,
        domain: parseUrl(APP_URL).domain,
        sameSite: 'lax',
        secure: true,
        expires: expiredAt,
      }
    )
  }

  async login(user: ProviderUserContract<User>, ...args: any[]): Promise<User> {
    const id = user.getId()

    await this.setSession(+id)

    this.markUserAsLoggedIn(user, true)

    return user.getUserFor()
  }

  async loginViaId(id: string | number, ...args: any[]): Promise<any> {
    const user = await db.query.users.findFirst({ where: eq(users.id, +id) })

    if (!user) {
      throw new Error(`Cannot find user with id "${id}"`)
    }

    await this.login(new ProviderUser(user), ...args)

    return user
  }

  /**
   * Authenticates the current HTTP request by checking for the bearer token
   */
  public async authenticate(): Promise<User> {
    const sessionCookie = cookies().get(this.sessionKeyName)?.value

    if (!sessionCookie) {
      throw new Error(`Cannot find "${this.sessionKeyName}" cookie`)
    }

    const signatureCookie = signature.unsign(sessionCookie, SESSION_SECRET)

    if (!signatureCookie) {
      throw new Error(`Cannot unsign "${this.sessionKeyName}" cookie`)
    }

    const [sessionId, token] = base64.urlDecode(signatureCookie).split('.')

    if (!token || !sessionId) {
      throw new Error(`Cannot decode "${this.sessionKeyName}" cookie`)
    }

    console.log('session', token)
    console.log('session', sessionId)

    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, +sessionId),
        eq(sessions.sessionToken, this.generateHash(token))
      ),
      with: {
        user: true,
      },
    })

    if (!session?.user) {
      throw new Error(`Cannot find user for "${this.sessionKeyName}" cookie`)
    }

    this.markUserAsLoggedIn(new ProviderUser(session.user), true)

    return session.user
  }

  /**
   * Same as [[authenticate]] but returns a boolean over raising exceptions
   */
  public async check(): Promise<boolean> {
    try {
      await this.authenticate()
      return true
    } catch (error) {
      return false
    }
  }
}
