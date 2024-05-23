import { RoutineAttributes } from './Routine'

export interface RoutineResponse
  extends Pick<RoutineAttributes, 'idx' | 'title' | 'color' | 'description' | 'weeklyCondition' | 'endTime'> {
  days: number[] | null
  completed: Date[] | null
}
