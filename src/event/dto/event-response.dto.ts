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

  @ApiProperty({ example: '집', description: '장소' })
  @Expose()
  place: string | null

  @ApiProperty({ example: '비고', description: '기타(추가) 내용 작성' })
  @Expose()
  description: string | null

  @ApiProperty({ example: 3, description: '몇일에 걸쳐있는지(없으면 null), 생성 및 수정시 undefined' })
  @Expose()
  being?: number | null

  @ApiProperty({ example: '2024-05-04 00:00:00', description: '시작 시간' })
  @Expose()
  startTime: Date

  @ApiProperty({ example: '2024-05-06 00:00:00', description: '종료 시간' })
  @Expose()
  endTime: Date

  @ApiProperty({ example: true, description: '반복설정으로 만든 데이터 유무' })
  @Expose()
  isRecurringData: boolean

  @ApiProperty({ example: 'D', description: 'D(일) | W(주) | M(월) | Y(연)' })
  @Expose()
  recurringType: string

  @ApiProperty({
    example: 1,
    description: '반복 주기 (interval)\nex)recurringType이 "D"이고 separationCount가 1일 경우: 격일 반복',
  })
  @Expose()
  separationCount?: number | null

  @ApiProperty({ example: 3, description: '최대 반복 횟수' })
  @Expose()
  maxNumOfOccurrances?: number | null

  @ApiProperty({ example: '2024-05-10 00:00:00', description: '반복 일정 자체가 종료되는 시간' })
  @Expose()
  recurrenceFinalEndTime?: Date

  @ApiProperty({ example: '2024-05-04 00:00:00', description: '반복 시작 시간' })
  @Expose()
  recurringStartTime?: Date | null

  @ApiProperty({ example: '2024-05-06 00:00:00', description: '반복 종료 시간' })
  @Expose()
  recurringEndTime?: Date | null

  @ApiProperty({ example: '2024-05-04 00:00:00', description: '원본 시작 시간' })
  @Expose()
  originStartTime?: Date | null

  @ApiProperty({ example: '2024-05-06 00:00:00', description: '원본 종료 시간' })
  @Expose()
  originEndTime?: Date | null

  constructor(event: EventResponse) {
    Object.assign(this, plainToClass(EventResponseDto, event, { excludeExtraneousValues: true }))
  }
}
