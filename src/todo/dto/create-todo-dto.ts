import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTodoDto {
  @ApiProperty({
    example: 'user ID',
    description: '로그인한 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  userId!: string

  @ApiPropertyOptional({ example: 'todo 제목', description: '입력한 할 일' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string

  @ApiPropertyOptional({ example: 'true / false', description: '완료 여부' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? 1 : 0))
  isDone: number

  @ApiPropertyOptional({ example: '2024-01-11 00:00:00', description: '해당 날짜' })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  appliedAt: Date

  @ApiPropertyOptional({ example: '1~10', description: '우선 순위' })
  @IsNumber()
  sequence?: number | null
}
