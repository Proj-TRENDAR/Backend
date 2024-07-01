import { ApiProperty } from '@nestjs/swagger'

export class TokenResponse {
  @ApiProperty({ example: 'aaaa.bbbb.cccc', description: 'JWT 엑세스 토큰' })
  accessToken: string

  @ApiProperty({ example: 'aaaa.bbbb.cccc', description: 'JWT 리프레시 토큰' })
  refreshToken: string

  @ApiProperty({ example: 'tester', description: '유저 아이디' })
  id: string

  @ApiProperty({ example: '테스터', description: '유저 이름' })
  userName: string

  @ApiProperty({ example: 1, description: '테마 컬러' })
  themeColor: number

  constructor(accessToken: string, refreshToken: string, id: string, userName: string, themeColor: number) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.id = id
    this.userName = userName
    this.themeColor = themeColor
  }
}
