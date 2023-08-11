import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@lib/css'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      full: {
        true: 'w-full',
      },
      loading: {
        true: 'gap-2',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      full: false,
      loading: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  loaderPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      rightIcon,
      leftIcon,
      loaderPosition = 'left',
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={loading ?? false}
        className={cn(buttonVariants({ variant, size, className, loading }), {
          'gap-2': !!leftIcon || !!rightIcon,
        })}
        ref={ref}
        {...props}
      >
        {(leftIcon || (loading && loaderPosition === 'left')) &&
          (loading && loaderPosition === 'left' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            leftIcon
          ))}

        {children}

        {(rightIcon || (loading && loaderPosition === 'right')) &&
          (loading && loaderPosition === 'right' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            rightIcon
          ))}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
