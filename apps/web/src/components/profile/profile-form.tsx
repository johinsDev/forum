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
import { FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
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
    values: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      name: user?.name ?? '',
      image: user?.image ?? null,
    },
  })

  const { mutateAsync: getPutSignedUrl } =
    api.user.getPutSignedUrl.useMutation()

  const onSubmit = async (values: profileValues) => {
    mutate(values)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      try {
        const { url, path } = await getPutSignedUrl({
          filename: file.name,
          filetype: file.type,
        })

        const res = await fetch(url, {
          method: 'PUT',
          body: file,
        })

        if (!res.ok) {
          throw new Error('Something went wrong')
        }

        form.setValue('image', path)
      } catch (error) {
        console.log(error)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag drop some files here, or click to select files</p>
          )}
        </div>

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

// TODO:
// dropzone styles
// preview image
// redaxios to review progress upload
// connect dropzone field with form
// if avatar comes from social, move to R2 storage

// procedure ralimit
// bull queue
// edge-csrf if we need procedure
// github action migrations
// rewrite email templates with tailwind
// nprogress
// function md5(content: string) {
//   return createHash('md5').update(content).digest('hex')

//   // const filename =
//   // ctx.session.user.id +
//   // '/' +
//   // md5(Date.now() + input.filename) +
//   // '.' +
//   // filetype.split('/')[1]
// }

// TWO FACTOR AUTH
// LINK AND UNLINK ACCOUNTS
// ACTIVATE ACCOUNTS
// DELETE ACCOUNTS

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
