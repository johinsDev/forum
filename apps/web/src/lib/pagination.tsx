import { z } from 'zod'

export const paginationInput = z.object({
  perPage: z
    .number()
    .min(1)
    .max(100)
    .positive()
    .default(10)
    .optional()
    .nullable(),
  page: z.number().min(1).default(1).optional().nullable(),
  cursor: z.number().nullish().optional(), // <-- "cursor" needs to exist, but can be any type
})

export interface PaginationProps extends z.infer<typeof paginationInput> {
  totalRows: number
}

export interface PaginationResult {
  perPage: number
  page: number
  offset: number
  totalRows: number
  limit: number
  totalPages: number
  nextPage: number
  prevPage: number
}

export function getMeta(input: PaginationProps): PaginationResult {
  let { perPage, page = 1, totalRows } = input

  perPage ??= 10

  page ??= 1

  const totalPages = Math.ceil(totalRows / perPage)

  page = Math.max(1, Math.min(page, totalPages))

  const offset = (page - 1) * perPage

  const nextPage = Math.min(page + 1, totalPages)

  const prevPage = Math.max(page - 1, 0)

  return {
    perPage,
    page,
    offset,
    totalRows,
    limit: perPage,
    totalPages,
    nextPage,
    prevPage,
  }
}
