import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port: number = configService.get('BACK_PORT')

  app.enableCors({
    origin: true, //url을 넣어도 됨.
    credentials: true,
  }) // cors 활성화
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // auto-transformation(request의 payload가 nest의 dto에 맞게 type를 변환 시켜주는 옵션)
      whitelist: true, // payload에서 dto에 없는 속성을 제거시켜주는 옵션
      transformOptions: { enableImplicitConversion: true }, // string에서 number, boolean, array 등으로 암시적으로 변환시켜주는 기능
      forbidNonWhitelisted: true, // dto에 없는 속성을 제거시켜주는 대신 error를 throw해주는 옵션
    })
  )
  await app.listen(port)
}
bootstrap()
