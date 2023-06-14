import { GuardContract } from 'Auth'
import { SessionGuard } from './session-guard'

export const sessionGuard = new SessionGuard('web', {
  driver: 'session',
})

class Authentication {
  guards: Map<string, GuardContract> = new Map()

  constructor() {
    this.guards.set('session', sessionGuard)
  }

  use(name: string) {
    const guard = this.guards.get(name)

    if (!guard) {
      throw new Error(`Guard ${name} is not defined`)
    }

    return guard
  }
}

export const auth = new Authentication()
