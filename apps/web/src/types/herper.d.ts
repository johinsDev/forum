// Source: https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
// Get nested keys of an object as a string literal union type
// Example:
// type NestedKeys = NestedKeyOf<Sealing>

import { FC, ReactNode } from 'react'

// const nestedKeys: NestedKeys = 'ship.name'
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type FCAuth<P = {}> = FC<P> & {
  auth?: {
    loading?: ReactNode
  }
}
