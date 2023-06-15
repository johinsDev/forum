declare module 'Auth' {
  export interface ProviderUserContract<User extends any> {
    user: User

    getUserFor(): User

    getId(): string | number
  }

  export interface GuardContract {
    name: Guard

    /**
     * Reference to the logged in user.
     */
    user?: ProviderUserContract

    /**
     * Find if the user has been logged out in the current request
     */
    isLoggedOut: boolean

    /**
     * A boolean to know if user is retrieved by authenticating
     * the current request or not.
     */
    isAuthenticated: boolean

    /**
     * Reference to the guard config
     */
    config: any

    /**
     * Login a user using their id
     */
    loginViaId(id: string | number, ...args: any[]): Promise<any>

    /**
     * Login a user without any verification
     */
    login(user: ProviderUserContract, ...args: any[]): Promise<any>

    /**
     * Attempts to authenticate the user for the current HTTP request. An exception
     * is raised when unable to do so
     */
    authenticate(): Promise<ProviderUserContract>

    /**
     * Attempts to authenticate the user for the current HTTP request and supresses
     * exceptions raised by the [[authenticate]] method and returns a boolean
     */
    check(): Promise<boolean>
  }
}
