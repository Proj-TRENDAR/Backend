import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class UpdateRoutineDto {
  @ApiPropertyOptional({ example: '아침 운동', description: 'Routine 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string

  @ApiPropertyOptional({ example: '1', description: '1~7(미정)' })
  @IsOptional()
  @IsNumber()
  color?: number

  @ApiPropertyOptional({ example: '일어나서 헬스하기', description: '루틴 메모' })
  @IsOptional()
  @IsString()
  description?: string | null

  @ApiPropertyOptional({ example: 3, description: '주간 목표 횟수<br/>(null일 경우 days 선택)' })
  @IsOptional()
  @IsNumber()
  weeklyCondition?: number | null

  @ApiPropertyOptional({
    example: [1, 3, 5],
    description:
      '0 = 일요일, 1 = 월요일, 2 = 화요일, 3 = 수요일, 4 = 목요일, 5 = 금요일, 6 = 토요일<br/>(null일 경우 weeklyCondition 선택)',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value.sort((a, b) => a - b) : value))
  days?: number[] | null

  @ApiProperty({
    example: '2024-05-29 00:00:00',
    description: '루틴 시작 날짜',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date

  @ApiProperty({
    example: '2024-06-20 23:59:59',
    description: '루틴 종료 날짜',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date | null
}
