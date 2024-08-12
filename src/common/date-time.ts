import { format } from 'date-fns-tz'

export function convertToKST(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Seoul' })
}
