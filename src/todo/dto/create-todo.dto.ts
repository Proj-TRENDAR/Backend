import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTodoDto {
  @ApiProperty({
    example: 'tester',
    description: '유저 ID',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  userId: string

  @ApiPropertyOptional({ example: 'todo 제목', description: '할 일' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title!: string

  @ApiProperty({
    example: '2024-04-11 00:00:00Z',
    description: '적용 날짜',
    required: true,
  })
  @IsDate()
  appliedAt: Date
}
