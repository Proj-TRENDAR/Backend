import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { EventAttributes } from 'models/Event'

export class EventResponseDto {
  @ApiProperty({ example: 1, description: 'Event idx' })
  @Expose()
  idx: number

  @ApiProperty({ example: '연휴', description: 'event 제목' })
  @Expose()
  title: string

  @ApiProperty({ example: true, description: '하루 종일 여부' })
  @Expose()
  isAllDay: number

  @ApiProperty({ example: 1, description: '1~7(temp) 색상' })
  @Expose()
  color: number

  @ApiProperty({ example: 3, description: '몇일에 걸쳐있는지(없으면 null), 생성 및 수정시 undefined' })
  @Expose()
  being?: number | null

  @ApiProperty({ example: '2024-05-04 00:00:00Z', description: '시작 시간' })
  @Expose()
  startTime: Date

  @ApiProperty({ example: '2024-05-06 00:00:00Z', description: '종료 시간' })
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
