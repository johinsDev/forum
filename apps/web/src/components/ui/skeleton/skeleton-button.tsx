import { cn } from '@/lib/css'
import { VariantProps } from 'class-variance-authority'
import { FC } from 'react'
import { buttonVariants } from '../button'

interface SkeletonButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  className?: string
}

const SkeletonButton: FC<SkeletonButtonProps> = ({
  children,
  full,
  size,
  className,
}) => {
  return (
    <div
      className={cn(
        className,
        buttonVariants({ size, full }),
        'animate-pulse bg-gray-200 text-transparent',
      )}
    >
      {children}
    </div>
  )
}

export default SkeletonButton
