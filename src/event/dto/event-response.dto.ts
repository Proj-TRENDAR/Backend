import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { EventAttributes } from 'models/Event'

export class EventResponseDto {
  @ApiProperty()
  @Expose()
  idx!: number

  @ApiProperty()
  @Expose()
  title!: string

  @ApiProperty()
  @Expose()
  isAllDay!: number

  @ApiProperty()
  @Expose()
  color!: number

  @ApiProperty()
  @Expose()
  being?: number | null

  @ApiProperty()
  @Expose()
  startTime: Date

  @ApiProperty()
  @Expose()
  endTime: Date

  constructor(data: EventAttributes & { being?: number | null }) {
    this.idx = data.idx
    this.title = data.title
    this.isAllDay = data.isAllDay
    this.color = data.color
    this.being = data.being
    this.startTime = data.startTime
    this.endTime = data.endTime
    Object.seal(this)
  }
}
