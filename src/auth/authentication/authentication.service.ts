import { HttpService } from '@nestjs/axios'
import { Injectable, Query, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'

import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from '../../../constants'

import { TokenResponse } from 'src/auth/authentication/dto/token.response'
import { UserService } from 'src/user/user.service'
import { User } from 'models'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async oauthLogin(code: string, social: string, res: any): Promise<TokenResponse> {
    console.log(code, social)
    console.log('oauthLogin')

    let user: User
    switch (social) {
      case 'kakao':
        user = await this.kakaoOauthLogin(code)
        break
      case 'google':
        break
      case 'naver':
        break
      default:
        throw new UnauthorizedException()
    }
    if (user) {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user.id),
        this.generateRefreshToken(user.id),
      ])
      await this.userService.setCurrentRefreshToken(user.id, refreshToken)

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      return { accessToken, refreshToken, id: user.id, userName: user.name }
    }
  }

  async kakaoOauthLogin(code: string): Promise<User> {
    try {
      console.log('kakaoOauthLogin')
      const { data } = await this.httpService.axiosRef.request({
        method: 'post',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        data: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URL,
          code,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
        },
      })
      const kakaoUserInfo = await this.httpService.axiosRef.request({
        method: 'get',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      const userInfo = await this.userService.findSpecificUserUsingId(kakaoUserInfo.data.id)
      if (!userInfo) {
        const createUserObject = {
          id: kakaoUserInfo.data.id,
          name: kakaoUserInfo.data.properties.nickname,
          email: kakaoUserInfo.data.kakao_account.email,
          imgUrl: kakaoUserInfo.data.properties.profile_image,
          social: 'kakao',
        }
        await this.userService.createUser(createUserObject)
      } else {
        return userInfo
      }

      return await this.userService.findSpecificUserUsingId(kakaoUserInfo.data.id)
    } catch (err) {
      throw new UnauthorizedException('카카오 로그인에 실패했습니다.')
    }
  }

  async generateAccessToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRE,
        subject: 'ACCESS',
      }
    )
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRE,
        subject: 'REFRESH',
      }
    )
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException()

    res.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
    })
  }
}
