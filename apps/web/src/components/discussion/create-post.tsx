import { useDiscussion } from '@/hooks/use-dicussion'
import { useRouterModal } from '@/hooks/use-router-modal'
import { useToast } from '@/hooks/use-toast'
import { createPost } from '@/schemas/post'
import { api } from '@/utils/api'
import { isTRPCClientError, isZodError } from '@/utils/is-trpc-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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

interface CreatePostProps {}

type postValues = z.infer<typeof createPost>

const CreatePost: FC<CreatePostProps> = ({}) => {
  const { toast } = useToast()

  const session = useSession()

  const { data } = useDiscussion()

  const { push } = useRouter()

  const form = useForm<postValues>({
    resolver: zodResolver(createPost),
    values: {
      discussionSlug: data?.slug!,
      body: '',
    },
  })

  const { open, onOpenChange } = useRouterModal('new-post')

  const utils = api.useContext()

  const mutation = api.post.create.useMutation({
    async onSuccess(response) {
      push({
        pathname: `/discussion/${data?.slug}`,
        query: {
          postId: response.post.id,
          page: 1,
        },
      })

      utils.post.postsByDiscussionId.invalidate({ slug: data?.slug })

      form.reset()

      toast({
        title: 'Success',
        description: 'Your post has been created.',
      })
    },
    onError(cause) {
      if (isTRPCClientError(cause)) {
        Object.entries(cause.data?.zodError?.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as keyof postValues, {
                type: 'manual',
                message,
              })
            }
          },
        )
      }

      toast({
        title: 'Error creating post',
        description: isZodError(cause) ? 'Something went wrong' : cause.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (values: postValues) => {
    mutation.mutate(values)
  }

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
          <DialogTitle>Replying to {data?.title}</DialogTitle>
          <DialogDescription>
            Reply to this discussion to continue the conversation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                loading={mutation.isLoading}
                className="mr-auto"
              >
                Reply
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
