'use client'
import Google from '@/app/icons/google'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email',
    })
    .min(2, {
      message: 'Email is too short',
    }),
})

interface UserAuthFormProps {
  type: 'sign-in' | 'sign-up'
}

const UserAuthForm: FC<UserAuthFormProps> = ({ type }) => {
  const [loading, setLoading] = useState(false)

  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function loginGoogle() {
    try {
      setLoadingGoogle(true)

      await signIn('google')
    } catch (error) {
      toast({
        title: 'Error signing up',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoadingGoogle(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)

      await signIn('email', {
        email: values.email,
        redirect: false,
      })

      form.reset()

      toast({
        title: 'Check your email',
        description: 'We sent a link to your email address.',
      })
    } catch (error) {
      toast({
        title: 'Error signing up',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 space-y-8 text-left"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@forum.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <Button type="submit" loading={loading}>
            {type === 'sign-in' ? 'Sign in' : 'Sign up'} with Email
          </Button>
          <Button
            type="button"
            variant="secondary"
            leftIcon={<Google className="h-5 w-5" />}
            onClick={loginGoogle}
            loading={loadingGoogle}
          >
            {type === 'sign-in' ? 'Sign in' : 'Sign up'} with Google
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserAuthForm
