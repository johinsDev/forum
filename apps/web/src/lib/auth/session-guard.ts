import { APP_URL, SESSION_SECRET } from '@/config'
import parseUrl from '@/utils/parse-url'
import { base64, string } from '@poppinss/utils/build/helpers'
import { GuardContract, ProviderUserContract } from 'Auth'
import signature from 'cookie-signature'
import { createHash } from 'crypto'
import { eq } from 'drizzle-orm'
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

    await db.insert(sessions).values({
      sessionToken: token.hash,
      expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userId,
    })

    cookies().set(
      this.sessionKeyName,
      signature.sign(
        base64.urlEncode(`${token.token}.${token.hash}`),
        SESSION_SECRET
      ),
      {
        httpOnly: true,
        domain: parseUrl(APP_URL).domain,
        sameSite: 'lax',
        secure: true,
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
}
