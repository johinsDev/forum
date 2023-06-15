'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LoginForm = () => {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const { push } = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.currentTarget))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          className=" block w-full"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="Password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          className="block w-full"
          required
          autoComplete="new-password"
        />
      </div>

      <div className='mt-4" flex items-center justify-end'>
        <Link
          href="auth/password-reset"
          className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Forgot your password?
        </Link>

        <Button
          className={cn('ml-4', isLoading && 'pointer-events-none opacity-50')}
          type="submit"
          disabled={isLoading}
        >
          Login
        </Button>
      </div>
    </form>
  )
}
