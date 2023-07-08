import * as React from 'react'

import { cn } from '@/lib/css'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-slate-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid="true"]:ring-red-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
