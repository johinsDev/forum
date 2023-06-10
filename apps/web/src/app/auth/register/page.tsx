import { createUser } from '@/app/actions/create-user'
import { Form } from '@/components/form'
import { InputCsrf } from '@/components/input-csrf'
import { FormButton } from '@/components/ui/form-button'
import { Input } from '@/components/ui/input'
import { InputMessage } from '@/components/ui/input-message'
import { Label } from '@/components/ui/label'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register',
}

export default async function Register() {
  return (
    <section>
      <Form action={createUser} className="space-y-4">
        <InputCsrf />

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            className=" block w-full"
            required
            autoFocus
          />
          <InputMessage path="username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            className=" block w-full"
            required
            autoComplete="name"
          />
          <InputMessage path="name" />
        </div>

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
          <InputMessage path="email" />
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
          <InputMessage path="password" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <Input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            className="block w-full"
            required
            autoComplete="new-password"
          />
          <InputMessage path="passwordConfirmation" />
        </div>

        <div className='mt-4" flex items-center justify-end'>
          <Link
            href={'auth/login'}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already registered?
          </Link>

          <FormButton className="ml-4" type="submit">
            Register
          </FormButton>
        </div>
      </Form>
    </section>
  )
}
