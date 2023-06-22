import { cn } from '@/lib/css'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
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
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
      full: false,
    },
  }
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
      loaderPosition = 'right',
      full,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={loading ?? false}
        className={cn(
          buttonVariants({ variant, size, className, loading, full }),
          {
            'gap-2': !!leftIcon || !!rightIcon,
          }
        )}
        ref={ref}
        {...props}
      >
        {(leftIcon || (loading && loaderPosition === 'right')) &&
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
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
