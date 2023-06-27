import { Driver, MessageComposeCallback } from './mail.interface'
import { Message } from './message'
import { ResendDriver } from './resend'

class Mailer {
  driver: Driver | null = null

  constructor() {}

  use(driver: Driver) {
    this.driver = driver

    return this
  }

  async send(callback: MessageComposeCallback) {
    if (!this.driver) {
      throw new Error('No driver set')
    }

    const message = new Message()

    await callback(message)

    return this.driver.send(message.toNode())
  }
}

export const mail = new Mailer().use(
  new ResendDriver(process.env.RENSEND_API_KEY!)
)
