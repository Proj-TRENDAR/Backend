import { EventAttributes } from './Event'

export interface EventResponse extends Pick<EventAttributes, 'idx' | 'isAllDay' | 'color' | 'startTime' | 'endTime'> {
  being?: number
}
