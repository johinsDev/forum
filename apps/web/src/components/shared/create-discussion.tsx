import { useRouterModal } from '@/hooks/use-router-modal'
import { useToast } from '@/hooks/use-toast'
import { createDiscussion } from '@/schemas/discussion'
import { api } from '@/utils/api'
import { isTRPCClientError, isZodError } from '@/utils/is-trpc-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SelectTopic } from '../home/select-topic'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import Editor from '../ui/editor'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

interface CreateDiscussionProps {}

type discussionValues = z.infer<typeof createDiscussion>

const CreateDiscussion: FC<CreateDiscussionProps> = ({}) => {
  const { toast } = useToast()

  const { open, onOpenChange } = useRouterModal('new-discussion')

  const form = useForm<discussionValues>({
    resolver: zodResolver(createDiscussion),
  })

  const utils = api.useContext()

  const mutation = api.discussion.create.useMutation({
    onSuccess() {
      utils.discussion.invalidate()

      form.reset()

      onOpenChange(false)

      toast({
        title: 'Success',
        description: 'Your discussion has been created.',
      })
    },
    onError(cause) {
      if (isTRPCClientError(cause)) {
        Object.entries(cause.data?.zodError?.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as keyof discussionValues, {
                type: 'manual',
                message,
              })
            }
          },
        )
      }

      toast({
        title: 'Error creating discussion',
        description: isZodError(cause) ? 'Something went wrong' : cause.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (values: discussionValues) => {
    mutation.mutate(values)
  }

  const session = useSession()

  const isAuth = session.status === 'authenticated'

  if (!isAuth) return null

  return (
    <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        position={'bottom'}
        shadow={false}
        rounded={false}
        size={'full'}
        withOverlay={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Discussion</DialogTitle>
          <DialogDescription>
            A discussion is a place to share ideas and collaborate with others.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="What's on your mind?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topicSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectTopic
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Editor placeholder="Start typing..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                loading={mutation.isLoading}
                className="mr-auto"
              >
                Create Discussion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDiscussion
