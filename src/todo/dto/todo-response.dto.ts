import { Exclude, Expose } from 'class-transformer'
import { TodoAttributes } from 'models/Todo'
import { ApiProperty } from '@nestjs/swagger'

export class TodoResponseDto {
  @ApiProperty({ example: '1', description: 'ToDo idx' })
  @Expose()
  idx: number

  @ApiProperty({ example: '할 일', description: 'todo 제목' })
  @Expose()
  title: string

  @ApiProperty({ example: 'false', description: '완료 여부' })
  @Expose()
  isDone: number

  @ApiProperty({ example: '1', description: '순서' })
  @Expose()
  sequence: number

  @ApiProperty({ example: '2024-04-11 00:00:00Z', description: '적용 날짜' })
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
