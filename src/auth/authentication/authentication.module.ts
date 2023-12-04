import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthenticationService } from './authentication.service'
import { UserService } from 'src/user/user.service'
import { AuthenticationController } from './authentication.controller'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    HttpModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
  ],
  providers: [AuthenticationService, UserService, JwtStrategy],
  controllers: [AuthenticationController],
})
export class authenticationModule {}
