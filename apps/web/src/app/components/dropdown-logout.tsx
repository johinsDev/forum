'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { signOut } from 'next-auth/react'
import { FC } from 'react'

interface DropdownLogoutProps {}

const DropdownLogout: FC<DropdownLogoutProps> = ({}) => {
  const { toast } = useToast()

  return (
    <DropdownMenuItem
      onClick={async () => {
        try {
          await signOut()
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'destructive',
          })
        }
      }}
    >
      Logout
    </DropdownMenuItem>
  )
}

export default DropdownLogout
