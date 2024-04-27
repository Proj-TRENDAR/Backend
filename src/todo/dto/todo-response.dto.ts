import { Exclude, Expose } from 'class-transformer'
import { TodoAttributes } from 'models/Todo'
import { ApiProperty } from '@nestjs/swagger'

export class TodoResponseDto {
  @ApiProperty()
  @Expose()
  idx: number

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  isDone: number

  @ApiProperty()
  @Expose()
  sequence: number

  @ApiProperty()
  @Expose()
  appliedAt: Date

  @Exclude()
  userId: string

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  constructor(data: TodoAttributes) {
    this.idx = data.idx
    this.title = data.title
    this.isDone = data.isDone
    this.sequence = data.sequence
    this.appliedAt = data.appliedAt
    Object.seal(this)
  }
}
