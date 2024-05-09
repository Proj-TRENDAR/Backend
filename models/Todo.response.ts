import { TodoAttributes } from './Todo'

export interface TodoResponse extends Pick<TodoAttributes, 'idx' | 'title' | 'isDone' | 'sequence' | 'appliedAt'> {}
