export const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

export const APP_URL =
  process.env.APP_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000'

export const MIME_TYPES = {
  // Images
  png: 'image/png',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  avif: 'image/avif',

  // Documents
  mp4: 'video/mp4',
  zip: 'application/zip',
  csv: 'text/csv',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  exe: 'application/vnd.microsoft.portable-executable',
} as const

export const IMAGE_MIME_TYPE = [
  MIME_TYPES.png,
  MIME_TYPES.gif,
  MIME_TYPES.jpeg,
  MIME_TYPES.svg,
  MIME_TYPES.webp,
  MIME_TYPES.avif,
]

export const PDF_MIME_TYPE = [MIME_TYPES.pdf]
export const MS_WORD_MIME_TYPE = [MIME_TYPES.doc, MIME_TYPES.docx]
export const MS_EXCEL_MIME_TYPE = [MIME_TYPES.xls, MIME_TYPES.xlsx]
export const MS_POWERPOINT_MIME_TYPE = [MIME_TYPES.ppt, MIME_TYPES.pptx]
export const EXE_MIME_TYPE = [MIME_TYPES.exe]
