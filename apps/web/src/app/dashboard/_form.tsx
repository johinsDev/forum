'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const FormTestAction = ({ onSubmit, children }: any) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValidating, isLoading },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .nonempty()
          .min(3)
          .refine(
            async (val) => {
              await new Promise((resolve) => setTimeout(resolve, 200))
              return val === 'john'
            },
            {
              message: 'name must be john',
            }
          ),
      })
    ),
  })

  console.log('isValidating', isValidating, isLoading)

  return (
    <form
      onSubmit={handleSubmit(async (formData, e) => {
        console.log('send')
        // get form data from e.target
        const data = Object.fromEntries(new FormData(e?.target).entries())
        console.log('data', formData)
        await onSubmit(data)
      })}
    >
      {children}
      <input type="text" {...register('name')} />
      <p>{errors.name?.message as string}</p>

      <button type="submit">JOHINSEC</button>
    </form>
  )
}
