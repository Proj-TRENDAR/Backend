import { Expose, plainToClass } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { RoutineResponse } from 'models/Routine.response'

export class RoutineResponseDto {
  @ApiProperty({ example: 1, description: 'Routine idx' })
  @Expose()
  idx: number

  @ApiProperty({ example: '운동', description: '루틴 제목' })
  @Expose()
  title: string

  @ApiProperty({ example: 1, description: '1~7(temp) 색상' })
  @Expose()
  color: number

  @ApiProperty({ example: '헬스 1시간 이상', description: '루틴 설명 or 계획' })
  @Expose()
  description: string | null

  @ApiProperty({ example: 3, description: '주간 목표 횟수<br/>(null일 경우 days 선택)' })
  @Expose()
  weeklyCondition: number | null

  @ApiProperty({
    example: [3, 5],
    description:
      '0 = 일요일, 1 = 월요일, 2 = 화요일, 3 = 수요일, 4 = 목요일, 5 = 금요일, 6 = 토요일<br/>(null일 경우 weeklyCondition 선택)',
  })
  @Expose()
  days: number[] | null

  @ApiProperty({ example: '2024-05-08 00:00:00', description: '루틴 시작 날짜' })
  @Expose()
  startTime: Date

  @ApiProperty({ example: '2024-06-08 00:00:00', description: '루틴 종료 날짜' })
  @Expose()
  endTime: Date | null

  @ApiProperty({ example: ['2024-05-11 11:25:00', '2024-05-13 14:37:00'], description: '완료한 시간' })
  @Expose()
  completed: Date[]

  @ApiProperty({ example: '2024-06-09 02:12:00', description: '루틴 삭제 날짜' })
  @Expose()
  deletedAt: Date | null

  constructor(routine: RoutineResponse) {
    Object.assign(this, plainToClass(RoutineResponseDto, routine, { excludeExtraneousValues: true }))
  }
}
