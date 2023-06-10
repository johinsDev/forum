'use client'

import { atomErrors } from '@/components/form'
import { cn } from '@/lib/css'
import { useAtomValue } from 'jotai'
import { forwardRef } from 'react'

export const InputMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    path: string
  }
>(({ className, children, path, ...props }, ref) => {
  const errors = useAtomValue(atomErrors)

  const error = errors.get(path) ?? null

  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})

InputMessage.displayName = 'InputMessage'
