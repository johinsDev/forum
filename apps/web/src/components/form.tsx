'use client'
import { useToast } from '@/components/ui/use-toast'
import { atom, useSetAtom } from 'jotai'
import { z } from 'zod'
import { ActionResponse } from '../app/actions/create-user'

type FormProps = {
  children?: React.ReactNode
  action: (formData: FormData) => Promise<ActionResponse>
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'>

export const atomErrors = atom<Map<string, { code: string; message: string }>>(
  new Map()
)

function parseErrors(errors: z.ZodIssue[]) {
  const mapErrors = new Map<
    string,
    {
      code: string
      message: string
    }
  >()

  errors.forEach((error) => {
    const { code, message, path } = error

    const _path = path.join('.')

    if (!mapErrors.has(_path)) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0]

        mapErrors.set(_path, {
          code: unionError.code,
          message: unionError.message,
        })
      } else {
        mapErrors.set(_path, {
          code,
          message,
        })
      }
    }
  })

  return mapErrors
}

export const Form = ({ action, children, ...props }: FormProps) => {
  const update = useSetAtom(atomErrors) // TODO replace by zustand

  const { toast } = useToast()

  return (
    <form
      action={async (formData) => {
        update(new Map())

        const response = await action(formData)

        if (response?.error) {
          if (response.errors) {
            const mapErrors = parseErrors(response.errors ?? [])

            update(mapErrors)

            // Focus first input with error
            const firstError = mapErrors.keys().next().value

            if (firstError) {
              const input = document.querySelector(
                `input[name="${firstError}"]`
              ) as HTMLInputElement

              input.focus()
            }
          }

          toast({
            title: 'Error',
            description: response.error || 'Please check the form for errors',
            variant: 'destructive',
          })

          return
        }
      }}
      {...props}
    >
      {children}
    </form>
  )
}
