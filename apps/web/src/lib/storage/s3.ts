import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl as getSignedUrlS3 } from '@aws-sdk/s3-request-presigner'
import ms from 'ms'
import { date } from '../date'

/**
 * Content options for files
 */
export type ContentHeaders = {
  contentType?: string
  contentLanguage?: string
  contentEncoding?: string
  contentDisposition?: string
  cacheControl?: string
  contentLength?: string | number
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

function transformContentHeaders(options?: ContentHeaders) {
  const contentHeaders: Omit<GetObjectCommandInput, 'Key' | 'Bucket'> = {}
  const {
    contentType,
    contentDisposition,
    contentEncoding,
    contentLanguage,
    cacheControl,
  } = options || {}

  if (contentType) {
    contentHeaders['ResponseContentType'] = contentType
  }

  if (contentDisposition) {
    contentHeaders['ResponseContentDisposition'] = contentDisposition
  }

  if (contentEncoding) {
    contentHeaders['ResponseContentEncoding'] = contentEncoding
  }

  if (contentLanguage) {
    contentHeaders['ResponseContentLanguage'] = contentLanguage
  }

  if (cacheControl) {
    contentHeaders['ResponseCacheControl'] = cacheControl
  }

  return contentHeaders
}

const COMMANDS = {
  GET: GetObjectCommand,
  PUT: PutObjectCommand,
  DELETE: DeleteObjectCommand,
}

export const getSignedUrl = async (
  filename: string,
  options?: ContentHeaders & {
    expiresIn?: string
    method?: 'PUT' | 'DELETE' | 'GET'
  }
) => {
  const method = options?.method || 'GET'

  const Command = COMMANDS[method]

  try {
    return await getSignedUrlS3(
      client,
      new Command({
        Key: filename,
        Bucket: process.env.R2_BUCKET_NAME!,
        ...transformContentHeaders(options),
      }),
      {
        expiresIn: ms(options?.expiresIn || '15min') / 1000,
      }
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error generating signed url')
  }
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const getSignedUrlForGet = async (
  path: string | null,
  currentUrl?: string | null,
  options?: ContentHeaders & {
    expiresIn?: string
  }
) => {
  if (!path) {
    return ''
  }

  if (currentUrl && !isValidUrl(currentUrl)) {
    currentUrl = null
  }

  // If there is no current url, generate a new one
  if (!currentUrl) {
    return getSignedUrl(path, {
      ...options,
      method: 'GET',
    })
  }

  // Parse the url to get the expire date
  const params = new URL(currentUrl).searchParams

  // If there is no expire date, generate a new one
  const expireDate = params.get('X-Amz-Date') ?? ''

  const expiresSeconds = parseInt(params.get('X-Amz-Expires') ?? '0')

  // Parse the expire date to a date object and add the expires seconds
  const expireDateParsed = date(
    Date.parse(expireDate.replace(/(....)(..)(..T..)(..)/, '$1-$2-$3:$4:'))
  ).add(expiresSeconds, 'second')

  const now = date()

  // If the url is expired, generate a new one
  if (now.isAfter(expireDateParsed)) {
    return getSignedUrl(path, {
      ...options,
      method: 'GET',
    })
  }

  return currentUrl
}
