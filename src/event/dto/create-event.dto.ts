import { IsString, IsDate, IsOptional, IsNumber, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class CreateEventDto {
  @ApiProperty({
    example: 'userID',
    description: '로그인한 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  userId!: string

  @ApiProperty({
    example: 'event title',
    description: '일정 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title!: string

  @ApiProperty({
    example: 'true',
    description: '하루종일 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  isAllDay!: number

  @ApiProperty({
    example: '2024-01-11 11:20:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 설정 날짜 기입<br/>(ex) 2024-01-11 00:00:00)',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value, obj }) => {
    if (obj.isAllDay) {
      const date = new Date(value)
      return new Date(date.setHours(0, 0, 0, 0))
    } else {
      return value
    }
  })
  @Type(() => Date)
  @IsDate()
  startTime!: Date

  @ApiProperty({
    example: '2024-01-11 11:50:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 설정 날짜 기입<br/>(ex) 2024-01-11 00:00:00)',
  })
  @IsNotEmpty()
  @Transform(({ value, obj }) => {
    if (obj.isAllDay) {
      const date = new Date(value)
      return new Date(date.setHours(0, 0, 0, 0))
    } else {
      return value
    }
  })
  @Type(() => Date)
  @IsDate()
  endTime!: Date

  @ApiProperty({
    example: '1',
    description: '1~7(미정)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  color!: number

  @ApiProperty({
    example: '서울시 광진구 광장동',
    description: '200자 이내 주소 입력(추후 지도 api 사용)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  place?: string | null

  @ApiProperty({
    example: '땡땡이와 바뱍',
    description: '일정 메모',
  })
  @IsOptional()
  @IsString()
  description?: string | null

  @ApiProperty({
    example: 'true',
    description: '반복 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  isRecurring!: number

  @ApiPropertyOptional({
    example: 'D',
    description: '반복 타입<br/>D(일) | W(주) | M(월) | Y(연)',
  })
  @IsOptional()
  @IsString()
  recurringType?: string

  @ApiPropertyOptional({
    example: '0',
    description: '간격 주기 설정<br/>(ex) 반복 타입이 주간일 경우, 1 : 격주)',
  })
  @IsOptional()
  @IsNumber()
  separationCount?: number

  @ApiPropertyOptional({
    example: '1',
    description: '(isRecurring이 true일 경우) 최대 반복 횟수',
  })
  @IsOptional()
  @IsNumber()
  maxNumOfOccurrances?: number

  @ApiPropertyOptional({
    example: '2024-01-19 11:50:00',
    description: '(isRecurring이 true일 경우) 반복 종료 시간',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  recurringEndTime: Date

  @ApiPropertyOptional({
    example: '0',
    description:
      '주간 특정 요일 설정(여러 요일일 경우 row 각각 생성)<br/>(0 = 일요일, 1 = 월요일, 2 = 화요일, 3 = 수요일, 4 = 목요일, 5 = 금요일, 6 = 토요일)',
  })
  @IsOptional()
  @IsNumber()
  dayOfWeek?: number

  @ApiPropertyOptional({
    example: '3',
    description: '월간 특정 일 설정(1~31)',
  })
  @IsOptional()
  @IsNumber()
  dayOfMonth?: number

  @ApiPropertyOptional({
    example: '1',
    description: '월간 특정 주 설정(1~5)',
  })
  @IsOptional()
  @IsNumber()
  weekOfMonth?: number

  @ApiPropertyOptional({
    example: '2',
    description: '연간 특정 월 설정(1~12)',
  })
  @IsOptional()
  @IsNumber()
  monthOfYear?: number
}
