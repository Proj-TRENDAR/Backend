import { IsString, IsEmail, IsOptional, IsNotEmpty, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    example: 'tester',
    description: '유저 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(45)
  id: string

  @ApiProperty({
    example: '테스터',
    description: '유저 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(45)
  name: string

  @ApiProperty({
    example: 'tester@gamil.com',
    description: '유저 이메일',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(100)
  email: string

  @ApiProperty({
    example: 'image url...',
    description: '유저 이미지',
  })
  @IsOptional()
  @IsString()
  imgUrl: string

  @ApiProperty({
    example: 'kakao, naver, google',
    description: '소셜 로그인 플랫폼',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  social: string
}
