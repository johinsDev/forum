import { GuardContract, ProviderUserContract } from 'Auth'
import { User } from '../db/schema'
import { SessionGuard } from './session-guard'

export const sessionGuard = new SessionGuard('web', {
  driver: 'session',
})

class Authentication {
  guards: Map<string, GuardContract> = new Map()

  constructor() {
    this.guards.set('session', sessionGuard)
  }

  /**
   * Reference to the logged in user
   */
  public get user() {
    return (this.use().user as ProviderUserContract<User> | undefined)?.user
  }

  /**
   * A boolean to know if user is retrieved by authenticating
   * the current request or not.
   */
  public get isAuthenticated() {
    return this.use().isAuthenticated
  }

  use(name?: string) {
    const guard = this.guards.get(name ?? 'session')

    if (!guard) {
      throw new Error(`Guard ${name} is not defined`)
    }

    return guard
  }

  /**
   * Login a user without any verification
   */
  public async login(user: any, ...args: any[]) {
    return this.use().login(user, ...args)
  }

  /**
   * Login a user using their id
   */
  public async loginViaId(id: string | number, ...args: any[]) {
    return this.use().loginViaId(id, ...args)
  }

  /**
   * Authenticates the current HTTP request by checking for the bearer token
   */
  public async authenticate() {
    return this.use().authenticate()
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

export const auth = new Authentication()
