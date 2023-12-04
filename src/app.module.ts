import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './user/user.model'
import { Social } from './social/social.model'
import { UserModule } from './user/user.module'
import { SocialModule } from './social/social.module'
import { authenticationModule } from './auth/authentication/authentication.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'dev' ? '.dev.env' : '.prod.env',
      isGlobal: true,
      // Joi 추가 시 사용
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string().valid('dev', 'prod').required(),
      //   DB_HOST: Joi.string().required(),
      //   DB_PORT: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWD: Joi.string().required(),
      //   DB_DATABASE: Joi.string().required(),
      // }),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      models: [User, Social],
      autoLoadModels: true, // models will be loaded automatically
      synchronize: true, //  automatically loaded models will be synchronized
    }),
    UserModule,
    SocialModule,
    authenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
