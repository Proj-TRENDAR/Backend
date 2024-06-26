import { Expose, plainToClass, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { EventResponse } from 'models/Event.response'

export class EventResponseDto {
  @ApiProperty({ example: 1, description: 'Event idx' })
  @Expose()
  idx: number

  @ApiProperty({ example: '연휴', description: 'event 제목' })
  @Expose()
  title: string

  @ApiProperty({ example: true, description: '하루 종일 여부' })
  @Expose()
  isAllDay: boolean

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

  @ApiProperty({ example: true, description: '반복설정으로 만든 데이터 유무' })
  @Expose()
  isRecurringData: boolean

  @ApiProperty({ example: true, description: 'isRecurringData가 true일 경우, 원본 시작 시간' })
  @Expose()
  @Transform(({ obj }) => (obj.isRecurringData ? obj.originStartTime : null))
  originStartTime?: Date | null

  @ApiProperty({ example: true, description: 'isRecurringData가 true일 경우, 원본 종료 시간' })
  @Expose()
  @Transform(({ obj }) => (obj.isRecurringData ? obj.originStartTime : null))
  originEndTime?: Date | null

  constructor(event: EventResponse) {
    Object.assign(this, plainToClass(EventResponseDto, event, { excludeExtraneousValues: true }))
  }
}
