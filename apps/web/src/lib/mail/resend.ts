import { Resend } from 'resend'
import { Driver, MessageNode } from './mail.interface'

export class ResendDriver implements Driver {
  resend: Resend

  constructor(key: string) {
    this.resend = new Resend(key)
  }

  send(message: MessageNode) {
    return this.resend.sendEmail(message)
  }
}
