import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

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
  @IsArray()
  days: number[] | null

  // @ApiProperty({
  //   example: '10',
  //   description: '달성 갯수',
  // })
  // @IsOptional()
  // @IsNumber()
  // numOfAchievements: number | null

  @ApiProperty({
    example: '2024-01-11 11:20:00',
    description: '시작 날짜 받기? or 만든 날짜부터?',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date

  // @ApiProperty({
  //   example: '2024-01-11 11:20:00',
  //   description: '루틴 삭제 시 값 입력 됨',
  // })
  // @IsOptional()
  // @Type(() => Date)
  // @IsDate()
  // endTime: Date | null

  @ApiProperty({
    example: '1',
    description: '루틴 순서(TODO: 루틴 순서 적용 로직 필요)',
  })
  @IsOptional()
  @IsNumber()
  sequence: number | null
}
