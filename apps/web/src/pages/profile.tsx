import { ProfileFormSkeleton } from '@/components/profile/profile-form-skeleton'
import { FCAuth } from '@/types/herper'
import SkeletonButton from '@skeleton/skeleton-button'
import dynamic from 'next/dynamic'
import React from 'react'

const ProfileForm = dynamic(() => import('@/components/profile/profile-form'), {
  loading() {
    return <ProfileFormSkeleton />
  },
})

const DeleteAccount = dynamic(
  () => import('@/components/profile/delete-account'),
  {
    loading() {
      return <ProfileFormSkeleton />
    },
  },
)

interface ProfilePageProps {}

interface LayoutProps {
  profile: React.ReactNode
  deleteAccount?: React.ReactNode
}

const Layout = ({ deleteAccount, profile }: LayoutProps) => {
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

            <div className="mt-6 space-y-6">{profile}</div>
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <section className="space-y-6">
              <header>
                <h2 className="text-lg font-medium text-gray-900">
                  Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Once your account is deleted, all of its resources and data
                  will be permanently deleted. Before deleting your account,
                  please download any data or information that you wish to
                  retain.
                </p>
              </header>
              {deleteAccount}
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}

const ProfilePage: FCAuth<ProfilePageProps> = ({}) => {
  return <Layout deleteAccount={<DeleteAccount />} profile={<ProfileForm />} />
}

ProfilePage.auth = {
  loading: (
    <Layout
      profile={<ProfileFormSkeleton />}
      deleteAccount={<SkeletonButton>DELETE ACCOUNT</SkeletonButton>}
    />
  ),
}

export default ProfilePage
