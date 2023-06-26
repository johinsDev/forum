import { JSXElementConstructor, ReactElement } from 'react'
import { MessageContract, MessageNode } from './mail.interface'

export class Message implements MessageContract {
  private messageNode: MessageNode = {} as MessageNode

  constructor() {}

  to(address: string): this {
    this.messageNode.to = Array.isArray(this.messageNode.to)
      ? this.messageNode.to
      : []

    this.messageNode.to.push(address)
    return this
  }

  from(address: string): this {
    this.messageNode.from = address
    return this
  }

  cc(address: string): this {
    this.messageNode.cc = Array.isArray(this.messageNode.cc)
      ? this.messageNode.cc
      : []

    this.messageNode.cc.push(address)
    return this
  }

  bcc(address: string): this {
    this.messageNode.bcc = Array.isArray(this.messageNode.bcc)
      ? this.messageNode.bcc
      : []

    this.messageNode.bcc.push(address)
    return this
  }

  html(content: string): this {
    this.messageNode.html = content
    return this
  }

  react(content: ReactElement<any, string | JSXElementConstructor<any>>): this {
    this.messageNode.react = content
    return this
  }

  text(content: string): this {
    this.messageNode.text = content
    return this
  }

  replyTo(address: string): this {
    this.messageNode.reply_to = Array.isArray(this.messageNode.reply_to)
      ? this.messageNode.reply_to
      : []

    this.messageNode.reply_to.push(address)
    return this
  }

  tag(name: string, value: string): this {
    this.messageNode.tags = Array.isArray(this.messageNode.tags)
      ? this.messageNode.tags
      : []

    this.messageNode.tags.push({ name, value })
    return this
  }

  subject(message: string): this {
    this.messageNode.subject = message
    return this
  }

  attach(
    content: string | Buffer,
    filename?: string | undefined,
    path?: string | undefined
  ): this {
    this.messageNode.attachments = Array.isArray(this.messageNode.attachments)
      ? this.messageNode.attachments
      : []

    this.messageNode.attachments.push({ content, filename, path })
    return this
  }

  toNode(): MessageNode {
    return this.messageNode
  }
}
