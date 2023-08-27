import { cn } from '@/lib/css'
import { api } from '@/utils/api'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { UploadCloudIcon } from 'lucide-react'
import Image from 'next/image'
import { FC, useCallback, useState } from 'react'
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone'
import { Progress } from './ui/progress'

// TODO composition
// TODO controlled and uncontrolled
// Multiples flow
// error from backend (border red, error message icon) use useMutation fromr eact query to habdle didferents state
// name file
// delete file, see image in modal
// spread props
// support async flow (function to get signed url)

interface UploadProps extends Omit<DropzoneOptions, 'accept'> {
  value: string | null
  onChange: (value: string | null) => void
  /** File types to accept  */
  accept?: Accept | string[]
}

const Upload: FC<UploadProps> = ({ value, onChange, accept }) => {
  const [progress, setProgress] = useState(0)

  const { mutateAsync: getPutSignedUrl } =
    api.user.getPutSignedUrl.useMutation()

  const onUploadProgress = useCallback(
    debounce((progressEvent: any) => {
      if (!progressEvent.total) {
        return
      }

      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      )

      setProgress(progress)
    }, 100),
    [],
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      try {
        setProgress(10)

        const { putUrl, getUrl } = await getPutSignedUrl({
          filename: file.name,
          filetype: file.type,
        })

        await axios.put(putUrl, file, {
          onUploadProgress,
        })

        onChange(getUrl)
      } catch (error) {
        console.log(error)
      } finally {
        setProgress(0)
      }
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: Array.isArray(accept)
      ? accept.reduce((r, key) => ({ ...r, [key]: [] }), {})
      : accept,
  })

  const hasProgress = progress > 0 && progress < 100

  const hasValue = !!value && progress === 0

  return (
    <div
      {...getRootProps()}
      className="hover:border-primary-600 relative flex aspect-square h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-slate-100 p-2 text-center"
    >
      <input {...getInputProps()} />

      {hasValue && (
        <Image
          src={value}
          className="aspect-square object-cover"
          alt="avatar"
          width={144}
          height={144}
        />
      )}

      {hasProgress && <p className="text-sm">Uploading {progress}%</p>}

      {!value && (
        <>
          <UploadCloudIcon className="h-8 w-8 text-primary" />
          <p className="text-sm font-bold text-slate-600">
            Drop your avatar here, or{' '}
            <span className="text-primary">browse</span>
          </p>
        </>
      )}

      {hasProgress && <Progress value={progress} className={cn('mt-2 h-1')} />}
    </div>
  )
}

export default Upload
