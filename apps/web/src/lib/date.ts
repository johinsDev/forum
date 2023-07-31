import dayjs, { ConfigType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const to = (
  compared: ConfigType,
  date?: ConfigType,
  withoutSuffix?: boolean,
) => dayjs(date).to(compared, withoutSuffix)

export const toDate = (date?: ConfigType) => dayjs(date).toDate()

export const date = dayjs
