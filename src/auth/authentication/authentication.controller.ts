import { Controller, Get, Query, Post, Res, Req, UseInterceptors } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { AuthenticationService } from './authentication.service'
import { TokenResponse } from 'src/auth/authentication/dto/token.response'
import { TransactionParam } from 'src/share/transaction/param'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'

@Controller('auth') // http://localhost:3000/auth
@ApiTags('Auth API')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseInterceptors(TransactionInterceptor)
  @Get('login')
  @ApiOperation({ summary: 'Oauth 로그인' })
  async login(
    @Query('code') code: string,
    @Query('social') social: string,
    @Res({ passthrough: true }) res: Response,
    @TransactionParam() transaction: Transaction
  ): Promise<TokenResponse> {
    return await this.authenticationService.oauthLogin(code, social, res, transaction)
  }

  @Post('logout')
  @ApiOperation({ summary: '토큰을 만료 처리합니다.' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    return await this.authenticationService.logout(req, res)
  }
}
