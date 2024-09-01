import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsDate, IsIn, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateEventDto {
  @ApiPropertyOptional({ description: '일정 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title: string

  @ApiPropertyOptional({ description: '하루종일 여부' })
  @IsOptional()
  @IsNumber()
  isAllDay: number

  @ApiPropertyOptional({
    example: '2024-01-11 11:20:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 설정 날짜 기입<br/>(ex) 2024-01-11 00:00:00)',
  })
  @IsOptional()
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
  startTime: Date | null

  @ApiPropertyOptional({
    example: '2024-01-11 11:50:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 설정 날짜 기입<br/>(ex) 2024-01-11 00:00:00)',
  })
  @IsOptional()
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
  endTime: Date | null

  @ApiPropertyOptional({ example: 1, description: '1~7(미정)' })
  @IsOptional()
  @IsNumber()
  color: number

  @ApiPropertyOptional({ example: '서울시 용산구', description: '200자 이내 주소 입력(추후 지도 api 사용)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  place: string | null

  @ApiPropertyOptional({ example: '모임', description: '일정 메모' })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiPropertyOptional({ example: 'true', description: '반복 여부' })
  @IsOptional()
  @IsNumber()
  isRecurring: number

  @ApiPropertyOptional({
    example: 'D',
    description: '반복 타입<br/>D(일) | W(주) | M(월) | Y(연)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['D', 'W', 'M', 'Y'], { message: '반복 타입은 D, W, M, Y 중 하나여야 합니다.' })
  recurringType?: string

  @ApiPropertyOptional({
    example: 0,
    description: '간격 주기 설정<br/>(ex) 반복 타입이 주간일 경우, 1 : 격주)',
  })
  @IsOptional()
  @IsNumber()
  separationCount?: number

  @ApiPropertyOptional({
    example: 1,
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
    example: [0, 2, 4, 5],
    description:
      '주간 특정 요일 설정(여러 요일일 경우 row 각각 생성)<br/>(0 = 일요일, 1 = 월요일, 2 = 화요일, 3 = 수요일, 4 = 목요일, 5 = 금요일, 6 = 토요일)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  dayOfWeek?: number[]

  @ApiPropertyOptional({
    example: [1, 15],
    description: '월간 특정 일 설정(1~31)<br/>없을시 null',
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  dateOfMonth?: number[]

  @ApiPropertyOptional({
    example: 1,
    description: '월간 특정 주 설정(1~5 | null)',
  })
  @IsOptional()
  @IsNumber()
  weekOfMonth?: number

  @ApiPropertyOptional({
    example: [2, 5, 8],
    description: '연간 특정 월 설정(1~12)<br/>없을시 null',
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  monthOfYear?: number[]
}
