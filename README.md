# Cruisebound - A simple, clone of sailing app

## Description

A clone using react and next of the sailing app, Cruisebound. To fetch the data I used React Server Components, which is a new feature of React that allows to fetch data on the server side. This app is a simple app that allows to search for sailing trips and book them.

## Table of Contents

1. [Installation](#installation)
2. [Demo](#demo)
3. [How create a filter][#filter]
4. [Sort/Pagination][#sort]

## Installation

To install this project you need to have node installed on your machine. Then you can clone the repo and run the following commands:

```bash
pnpm install
pnpm run dev
```

## Demo

To see a demo of this project you can go to [https://cruisebound-johinsdev.vercel.app/](https://cruisebound-johinsdev.vercel.app/)

## Filter

### Server

To create a filter you need to create a class extends from `AbstractFilter` and implement the `apply` method. This method will receive the query and the value of the filter. The query is a `Prisma` query and the value is the value of the filter. The `apply` method should return a boolean. For example:

```ts
import { AbstractFilter } from './FilterInterface'

export class QFilter extends AbstractFilter<Sealing, SearchParamsQ> {
  apply(sailing: Sealing) {
    const q = this.getSearchParamOrDefault('q', '')

    return JSON.stringify(sailing).toLowerCase().includes(q.toLowerCase())
  }
}
```

after that you need to add the filter to the `filters` array in the `Service`. For example:

```ts
export function getSealing(
  searchParams: SealingSearchParams,
  sailings: Sealing[]
) {
  const filters = [new QFilter(searchParams)]

  const results = applyFilters(searchParams, filters, sailings)

  return results
}
```

### Client

To create a filter on the client side you need to create a component that modify the url.To be easier
to create a filter you can use the `useNavigation` hook. This hook will give you the `params` and `updateQueryParams` function. The `params` is a `URLSearchParams` object and the `updateQueryParams` is a function that will receive a function that will receive the `URLSearchParams` object and you can modify it. For example:

```tsx
export function SearchFilter() {
  const { params, updateQueryParams } = useNavigation()

  const [value, setValue] = useState(params.get('q'))

  useDebounceEffect(
    () => {
      if (value === params.get('q')) return

      updateQueryParams((params) => {
        params.set('page', '1')

        if (value) {
          params.set('q', value)
        } else {
          params.delete('q')
        }
      })
    },
    [value],
    { wait: 500 }
  )

  useEffect(() => {
    if (params.get('q') === value) return

    setValue(params.get('q'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get('q')])

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="q">Search</label>
      <Input
        placeholder="Search"
        value={value ?? ''}
        name="q"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
```

## Sort

To use the sort you need to reuse the function `applySort` and pass the `SearchParams` and the `sort` function. The `sort` function will receive the `SearchParams` and the `Sailing` object and should return a number. For example:

```ts
export function getSealing(
  searchParams: SealingSearchParams,
  sailings: Sealing[]
) {
  const filters = [new QFilter(searchParams)]

  const results = applyFilters(searchParams, filters, sailings)

  data = applySort<Sealing>(data, searchParams.sort, searchParams.order)
}
```

applysort will return a new array with the sorted items.It can sort by nested properties. for example:

```ts
export const SEALING_SORT_OPTIONS: Partial<
  Record<NestedKeyOf<Sealing>, string>
> = {
  'ship.line.logo': 'Ship',
}
```

## Pagination

To use the pagination you need to reuse the function `applyPagination` and pass the `SearchParams` and the `data`. For example:

```ts
export function getSealing(
  searchParams: SealingSearchParams,
  sailings: Sealing[]
) {
  const filters = [new QFilter(searchParams)]

  const results = applyFilters(searchParams, filters, sailings)

  data = applySort<Sealing>(data, searchParams.sort, searchParams.order)

  data = applyPagination(data, searchParams.page, searchParams.limit)
}
```

applyPagination will return a new array with the paginated items.

# TODO

create a data per per PR
run migrations

push run migrations before to deploy
inject cloudflare R2 api
uptash api key to use ioredis/bull
mailtrap email

ioredis
storage r2
nodemailer
bull
update-rate-limitting
csrf
setup trpc
env t3

- ui
- delete account
- update email, username, name
- verify email flow
