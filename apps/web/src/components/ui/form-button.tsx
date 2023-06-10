'use client'
import { cn } from '@/lib/css'
import { experimental_useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './button'

export interface FormButtonProps extends ButtonProps {}

export const FormButton = ({ className, ...props }: FormButtonProps) => {
  const { pending } = experimental_useFormStatus()

  return (
    <Button
      disabled={pending}
      className={cn(className, pending && 'pointer-events-none opacity-50')}
      {...props}
    />
  )
}
