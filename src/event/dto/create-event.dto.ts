import { IsString, IsDate, IsOptional, IsNumber, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
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
  userId: string

  @ApiProperty({
    example: 'event title',
    description: '일정 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string

  @ApiProperty({
    example: 'true',
    description: '하루종일 여부(true일 경우 startTime, endTime null)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  isAllDay: number

  @ApiProperty({
    example: '2024-01-11 11:20:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 null',
  })
  @IsOptional()
  @Transform(({ value, obj }) => (obj.isAllDay === true ? null : value))
  @Type(() => Date)
  @IsDate()
  startTime: Date | null

  @ApiProperty({
    example: '2024-01-11 11:50:00',
    description: '하루종일 여부(isAllDay)가 true일 경우 null',
  })
  @IsOptional()
  @Transform(({ value, obj }) => (obj.isAllDay === true ? null : value))
  @Type(() => Date)
  @IsDate()
  endTime: Date | null

  @ApiProperty({
    example: '1',
    description: '1~7(미정)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  color: number

  @ApiProperty({
    example: '서울시 광진구 광장동',
    description: '200자 이내 주소 입력(추후 지도 api 사용)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  place: string | null

  @ApiProperty({
    example: '땡땡이와 바뱍',
    description: '일정 메모',
  })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiProperty({
    example: 'true',
    description: '반복 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  isRecurring: number
}
