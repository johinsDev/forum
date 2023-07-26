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
import { IMAGE_MIME_TYPE } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { profileSchema } from '@/schemas/user'
import { api } from '@/utils/api'
import { isTRPCClientError, isZodError } from '@/utils/is-trpc-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Upload from '../upload'

export type profileValues = z.infer<typeof profileSchema>

const ProfileForm: FC = () => {
  const { toast } = useToast()

  const { data: session, update } = useSession()

  const user = session?.user

  const { mutate, isLoading } = api.user.updateProfile.useMutation({
    onSuccess(data) {
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      })

      update(data)
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
          },
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
    values: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      name: user?.name ?? '',
      image: user?.image ?? null,
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Upload
                  multiple={false}
                  value={field.value}
                  onChange={field.onChange}
                  accept={IMAGE_MIME_TYPE}
                  maxSize={3 * 1024 ** 2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={isLoading} className="w-24">
          Save
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm

// TODO:
// if avatar comes from social, move to R2 storage
// procedure ralimit
// bull queue
// trpc syubscription
// edge-csrf if we need procedure
// github action migrations
// rewrite email templates with tailwind
// nprogress
// TWO FACTOR AUTH
// LINK AND UNLINK ACCOUNTS
// ACTIVATE ACCOUNTS
// error login/register review next-auth cuistom pages
// review integration with imgix loader
// event emitter
// next-translations
// ahooks
// drizzle-zod
// next-pwa
// next-svgr
// next-seo
// ligihouse CI
// commitlint\
// algolia
// stripte
// improve upload component
