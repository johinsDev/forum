'use client'

import CsrfInput from '@/components/csrf-input'
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
import { formatErrors } from '@/utils/format-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { Session } from 'next-auth'
import { FC, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfile } from '../actions/update-profile'
import { profileSchema, profileValues } from '../schemas/profile'

interface ProfileFormProps {
  user: Session['user']
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<profileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      name: user?.name ?? '',
    },
  })

  const onSubmit = (values: profileValues) => {
    startTransition(async () => {
      try {
        const res = await updateProfile(values)

        formatErrors<profileValues>(res?.error, form.setError)

        toast({
          title: 'Success',
          description: 'Your profile has been updated.',
        })
      } catch (ex) {
        const e = ex as Error

        toast({
          title: 'Error signing up',
          description: e.message ?? 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CsrfInput form={form} />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="john" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
