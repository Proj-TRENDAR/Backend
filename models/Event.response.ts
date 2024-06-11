import { EventAttributes } from './Event'

export interface EventResponse extends Pick<EventAttributes, 'idx' | 'color' | 'startTime' | 'endTime'> {
  isAllDay: boolean
  being?: number
  isRecurringData: boolean
  originStartTime?: Date
  originEndTime?: Date
}
