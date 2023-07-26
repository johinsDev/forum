import SkeletonButton from '@skeleton/skeleton-button'
import SkeletonField from '@skeleton/skeleton-field'
import { Label } from '@ui/label'
import { FC } from 'react'

export const ProfileFormSkeleton: FC = () => {
  return (
    <>
      <div className="space-y-8">
        <SkeletonField label="Username" />

        <SkeletonField label="Name" />

        <SkeletonField label="Email" />

        <div className="space-y-2">
          <Label>Avatar</Label>
          <div className="aspect-square h-36 animate-pulse rounded  bg-slate-200" />
        </div>

        <SkeletonButton className="w-24">Save</SkeletonButton>
      </div>
    </>
  )
}
