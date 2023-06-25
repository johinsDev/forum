import { getAuthSession } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import ProfileForm from './components/profile-form'

interface ProfilePageProps {}

export const metadata = {
  title: 'Profile',
  description: 'Profile page',
}

const ProfilePage: FC<ProfilePageProps> = async ({}) => {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/')
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold leading-tight text-gray-800">
        Profile
      </h2>

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <header>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Information
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Update your account`s profile information and email address.
              </p>
            </header>

            <div className="mt-6 space-y-6">
              <ProfileForm user={session.user} />
            </div>
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            delete form
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
