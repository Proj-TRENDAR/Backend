import { Controller, Get, Query, Post, Res, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Request, Response } from 'express'

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

  @Post('logout')
  @ApiOperation({ summary: '토큰을 만료 처리합니다.' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    return await this.authenticationService.logout(req, res)
  }
}
