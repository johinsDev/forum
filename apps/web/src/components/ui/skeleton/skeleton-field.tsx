import { FC } from 'react'
import { Label } from '../label'

interface SkeletonFieldProps {
  label: string | React.ReactNode
}

const SkeletonField: FC<SkeletonFieldProps> = ({ label }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="h-10 w-full animate-pulse rounded  bg-slate-200"></div>
    </div>
  )
}

export default SkeletonField
