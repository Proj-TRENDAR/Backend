import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'
import { format } from 'date-fns-tz'

export class CreateRoutineCompletedDto {
  @ApiProperty({
    example: 1,
    description: '루틴 인덱스',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  routineIdx: number

  @ApiProperty({
    example: '2024-06-09 02:12:00',
    description: '수행 완료 시간',
    required: true,
  })
  @IsNotEmpty()
  @Transform(
    ({ value }) => {
      return format(value, 'yyyy-MM-dd')
    },
    { toPlainOnly: true }
  )
  @IsDate()
  completedAt: Date
}
