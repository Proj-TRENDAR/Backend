import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import * as winston from 'winston'
import { utilities, WinstonModule } from 'nest-winston'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User, Todo, Social, Event, RecurringEvent, Routine, RoutineCompleted, RoutineDay } from 'models'
import { UserModule } from './user/user.module'
import { SocialModule } from './social/social.module'
import { AuthenticationModule } from './auth/authentication/authentication.module'
import { EventModule } from './event/event.module'
import { TodoModule } from './todo/todo.module'
import { RoutineModule } from './routine/routine.module'
import { ExceptionModule } from './exception/exception.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'dev' ? '.dev.env' : '.prod.env',
      cache: true, // 한 번 읽은 환경 변수의 값을 캐싱하여 속도 향상
      isGlobal: true, // ConfigModule을 다른 모듈에서불러와야 하는 번거로움 피함
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
      models: [User, Todo, Social, Event, RecurringEvent, Routine, RoutineCompleted, RoutineDay],
      // autoLoadModels: true, // models will be loaded automatically (이렇게 사용하려면 각 폴더에 models를 만들어야 함. ex) user.models.ts)
      synchronize: true, //  automatically loaded models will be synchronized(개발시에만 true)
      timezone: 'Asia/Seoul',
      dialectOptions: {
        timezone: '+09:00', // DB에서 가져올 때 시간 설정
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true,
      },
      logging: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각 표시
            utilities.format.nestLike('Trendar', {
              // 로그 출처인 appName('Trendar') 설정
              prettyPrint: true,
            })
          ),
        }),
      ],
    }),
    UserModule,
    SocialModule,
    AuthenticationModule,
    EventModule,
    TodoModule,
    RoutineModule,
    ExceptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
