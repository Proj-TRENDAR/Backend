import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'todo 제목', description: '입력한 할 일' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string

  @ApiPropertyOptional({ example: 'true / false', description: '완료 여부' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? true : false))
  isDone?: number

  @ApiPropertyOptional({ example: '2024-01-11 00:00:00', description: '해당 날짜' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  appliedAt?: Date

  @ApiPropertyOptional({ example: '1~10', description: '우선 순위' })
  @IsOptional()
  @IsNumber()
  sequence?: number | null
}
