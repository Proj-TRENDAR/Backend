import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

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

  @ApiPropertyOptional({ example: '2024-01-11 11:20:00', description: '하루종일 여부(isAllDay)가 true일 경우 null' })
  @IsOptional()
  @Transform(({ value, obj }) => (obj.isAllDay === true ? null : value))
  @Type(() => Date)
  @IsDate()
  startTime: Date | null

  @ApiPropertyOptional({ example: '2024-01-11 11:50:00', description: '하루종일 여부(isAllDay)가 true일 경우 null' })
  @IsOptional()
  @Transform(({ value, obj }) => (obj.isAllDay === true ? null : value))
  @Type(() => Date)
  @IsDate()
  endTime: Date | null

  @ApiPropertyOptional({ example: '1', description: '1~7(미정)' })
  @IsOptional()
  @IsNumber()
  color: number

  @ApiPropertyOptional({ description: '200자 이내 주소 입력(추후 지도 api 사용)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  place: string | null

  @ApiPropertyOptional({ description: '일정 메모' })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiPropertyOptional({ description: '반복 여부' })
  @IsOptional()
  @IsNumber()
  isRecurring: number
}
