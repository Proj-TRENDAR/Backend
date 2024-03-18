import { Exclude, Expose } from 'class-transformer'
import { TodoAttributes } from 'models/Todo'

export class TodoResponseDto {
  @Expose()
  idx: number

  @Exclude()
  userId: string

  @Expose()
  title: string

  @Expose()
  isDone: number

  @Expose()
  sequence: number

  @Expose()
  appliedAt: Date

  @Exclude()
  createdAt: string

  @Exclude()
  updatedAt: string

  constructor(data: TodoAttributes) {
    this.idx = data.idx
    this.title = data.title
    this.isDone = data.isDone
    this.sequence = data.sequence
    this.appliedAt = data.appliedAt
  }
}
