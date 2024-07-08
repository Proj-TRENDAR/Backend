import { Expose, plainToClass } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'models'

export class UserResponseDto {
  @ApiProperty({ example: 'tester', description: '사용자 아이디' })
  @Expose()
  id: string

  @ApiProperty({ example: '트렌더', description: '사용자 이름' })
  @Expose()
  name: string

  @ApiProperty({ example: 'bkks1004@naver.com', description: '가입시 입력한 이메일 주소' })
  @Expose()
  email: string

  @ApiProperty({ example: '', description: '' })
  @Expose()
  imgUrl: string

  @ApiProperty({ example: 1, description: '1~5' })
  @Expose()
  themeColor: number

  constructor(user: User) {
    Object.assign(this, plainToClass(UserResponseDto, user, { excludeExtraneousValues: true }))
  }
}
