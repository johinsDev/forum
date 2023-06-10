import { z } from 'zod'

export function validation(validationSchema: z.ZodSchema<any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const formData: FormData = args[0]

      const data = Object.fromEntries(formData)

      const validationError = await validationSchema.safeParseAsync(data)

      if (!validationError.success) {
        return {
          code: 'validation',
          error: 'Validation error',
          errors: validationError.error.issues,
        }
      }

      let result = originalMethod.apply(this, args)
      return result
    }
  }
}
