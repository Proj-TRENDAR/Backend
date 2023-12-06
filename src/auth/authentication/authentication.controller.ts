import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { AuthenticationService } from './authentication.service'
import { TokenResponse } from 'src/auth/authentication/dto/token.response'

@Controller('auth') // http://localhost:3000/auth
@ApiTags('Auth API')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('login')
  @ApiOperation({ summary: 'Oauth 로그인' })
  async login(
    @Query('code') code: string,
    @Query('social') social: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<TokenResponse> {
    return await this.authenticationService.oauthLogin(code, social, res)
  }
}
