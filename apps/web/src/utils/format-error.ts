import { UseFormSetError } from 'react-hook-form'
import { ZodFormattedError } from 'zod'

export const formatErrors = <T extends Record<string, any>>(
  error: ZodFormattedError<T> | undefined,
  setError: UseFormSetError<T>
) => {
  if (error) {
    Object.entries(error).forEach(([key, value]) => {
      if (!value) {
        return
      }

      const message =
        '_errors' in value ? value._errors.join(', ') : value.join(', ')

      setError(key as any, {
        type: 'manual',
        message,
      })
    })

    throw new Error('Validation error')
  }
}
