import { ReactElement } from 'react'
import { Tag } from 'resend/build/src/interfaces'

interface Attachment {
  content?: string | Buffer
  filename?: string | false | undefined
  path?: string
}

export type MessageComposeCallback = (
  message: MessageContract
) => void | Promise<void>

export interface MessageContract {
  /**
   * Common fields
   */
  to(address: string): this
  from(address: string): this
  cc(address: string): this
  bcc(address: string): this
  subject(message: string): this

  /**
   * Routing options
   */
  replyTo(address: string): this

  /**
   * Content options
   */
  html(content: string): this
  text(content: string): this
  react(content: ReactElement): this

  /**
   * Attachments
   */
  attach(content: string | Buffer, filename?: string, path?: string): this
  tag(name: string, value: string): this
}

export interface MessageNode {
  attachments?: Attachment[]
  bcc?: string | string[]
  cc?: string | string[]
  from: string
  html?: string
  react?: ReactElement | null
  reply_to?: string | string[]
  subject: string
  tags?: Tag[]
  text?: string
  to: string | string[]
}

export interface Driver {
  send(message: MessageNode): Promise<any>
}
