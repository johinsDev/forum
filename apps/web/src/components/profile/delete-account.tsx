import { useToast } from '@/hooks/use-toast'
import { api } from '@/utils/api'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface DeleteAccountProps {}

const DeleteAccount: FC<DeleteAccountProps> = ({}) => {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const { push } = useRouter()

  const { mutate, isLoading } = api.user.deleteAccount.useMutation({
    onError(error) {
      toast({
        title: 'Error deleting account',
        description: error.message ?? 'Something went wrong',
      })
    },
    async onSuccess() {
      await signOut({
        redirect: false,
      })

      setOpen(false)

      push('/sign-in')

      toast({
        title: 'Success',
        description: 'Your account has been deleted.',
      })
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="submit" variant={'destructive'} className="uppercase">
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {' '}
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would
            like to permanently delete your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={'destructive'} type="submit" loading={isLoading}>
              Delete Account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAccount
