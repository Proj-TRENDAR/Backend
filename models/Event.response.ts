import { EventAttributes } from './Event'
import { RecurringEventAttributes } from './RecurringEvent'

export interface EventResponse
  extends Pick<EventAttributes, 'idx' | 'color' | 'place' | 'description' | 'startTime' | 'endTime'>,
    Pick<RecurringEventAttributes, 'recurringType' | 'separationCount' | 'maxNumOfOccurrances'> {
  isAllDay: boolean
  being?: number
  isRecurringData: boolean
  recurrenceFinalEndTime?: RecurringEventAttributes['endTime'] | null
  recurringStartTime?: Date | null
  recurringEndTime?: Date | null
  originStartTime?: Date | null
  originEndTime?: Date | null
}
