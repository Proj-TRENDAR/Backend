import { Expose, plainToClass } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { RoutineCompletedAttributes } from '../../../models'

export class RoutineCompletedResponseDto {
  @ApiProperty({ example: 1, description: 'Routine Completed idx' })
  @Expose()
  idx: number

  @ApiProperty({ example: 1, description: 'Routine idx' })
  @Expose()
  routineIdx: number

  @ApiProperty({ example: '2024-06-09 02:12:00', description: '루틴 완료 날짜' })
  @Expose()
  completedAt: Date

  constructor(routineCompleted: RoutineCompletedAttributes) {
    Object.assign(this, plainToClass(RoutineCompletedResponseDto, routineCompleted, { excludeExtraneousValues: true }))
  }
}
