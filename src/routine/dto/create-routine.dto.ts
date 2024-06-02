import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { IsEndTimeValid } from '../../common/end-time-validator'

export class CreateRoutineDto {
  @ApiProperty({
    example: 'userID',
    description: '로그인한 ID',
  })
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(45)
  @IsOptional() // 인증 및 인가로 받아온 userId를 사용하기 위함
  userId: string

  @ApiProperty({
    example: '개발 공부',
    description: '루틴 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string

  @ApiProperty({
    example: '1',
    description: '1~7(미정)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  color: number

  @ApiProperty({
    example: 'Study NestJS',
    description: '루틴 설명 or 계획',
  })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiProperty({
    example: '1~7',
    description: '주간 목표 횟수<br/>(null일 경우 days 선택)',
  })
  @IsOptional()
  @IsNumber()
  weeklyCondition: number | null

  @ApiProperty({
    example: [3, 5],
    description:
      '0 = 일요일, 1 = 월요일, 2 = 화요일, 3 = 수요일, 4 = 목요일, 5 = 금요일, 6 = 토요일<br/>(null일 경우 weeklyCondition 선택)',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value.sort((a, b) => a - b) : value))
  days: number[] | null

  @ApiProperty({
    example: '2024-01-11 11:20:00',
    description: '루틴 시작 날짜',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date

  @ApiProperty({
    example: '2024-03-10 23:59:59',
    description: '루틴 종료 날짜',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsEndTimeValid()
  endTime: Date | null
}
