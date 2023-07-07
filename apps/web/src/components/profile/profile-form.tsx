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
import { profileSchema } from '@/schemas/user'
import { api } from '@/utils/api'
import { isTRPCClientError, isZodError } from '@/utils/is-trpc-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type profileValues = z.infer<typeof profileSchema>

const ProfileForm: FC = () => {
  const { toast } = useToast()

  const { data: session } = useSession()

  const user = session?.user

  const { mutate, isLoading } = api.user.updateProfile.useMutation({
    onSuccess() {
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      })
    },
    onError(cause) {
      if (isTRPCClientError(cause)) {
        Object.entries(cause.data?.zodError?.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as keyof profileValues, {
                type: 'manual',
                message,
              })
            }
          }
        )
      }

      toast({
        title: 'Error updating profile',
        description: isZodError(cause) ? 'Something went wrong' : cause.message,
        variant: 'destructive',
      })
    },
  })

  const form = useForm<profileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      name: user?.name ?? '',
    },
  })

  const onSubmit = async (values: profileValues) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
