import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateRoutineCompletedDto {
  @ApiProperty({
    example: 'routine idx',
    description: '루틴 인덱스 숫자',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  routineIdx: number

  @ApiProperty({
    example: '2024-01-11 11:20:00',
    description: '수행 완료 시간',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  completedAt: Date
}
