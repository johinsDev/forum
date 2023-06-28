import { FC, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem } from './ui/form'
import { Input } from './ui/input'

interface CsrfInputProps {
  form: UseFormReturn<any, any, undefined>
}

const CsrfInput: FC<CsrfInputProps> = ({ form }) => {
  useEffect(() => {
    const el = document.querySelector(
      'meta[name="x-csrf-token"]'
    ) as HTMLMetaElement | null

    if (el) form.setValue('csrfToken', el.content)
  }, [form])

  return (
    <FormField
      control={form.control}
      name="csrfToken"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default CsrfInput
