import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User, Todo, Social, Event, RecurringEvent, Routine, RoutineCompleted, RoutineDay } from 'models'
import { UserModule } from './user/user.module'
import { SocialModule } from './social/social.module'
import { AuthenticationModule } from './auth/authentication/authentication.module'
import { EventModule } from './event/event.module'
import { TodoModule } from './todo/todo.module'
import { RoutineModule } from './routine/routine.module'

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
      },
      logging: true,
    }),
    UserModule,
    SocialModule,
    AuthenticationModule,
    EventModule,
    TodoModule,
    RoutineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
