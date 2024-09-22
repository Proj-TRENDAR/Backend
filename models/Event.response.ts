import { EventAttributes } from './Event'

export interface EventResponse
  extends Pick<EventAttributes, 'idx' | 'color' | 'place' | 'description' | 'startTime' | 'endTime'> {
  isAllDay: boolean
  being?: number
  isRecurringData: boolean
  recurringStartTime?: Date
  recurringEndTime?: Date
  originStartTime?: Date
  originEndTime?: Date
}
