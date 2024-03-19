import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch() // 처리되지 않은 모든 예외를 잡을 때 사용
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()
    const stack = exception.stack

    // 우리가 다루는 대부분의 예외는 이미 NestJS 에서 HttpException 을 상속받는 클래스들로 제공하므로 HttpException 이 아닌
    // 예외는 알 수 없는 에러이다. 따라서 이를 InternalServerErrorException 으로 처리
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException()
    }

    const response = (exception as HttpException).getResponse()
    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    }
    this.logger.log(log)

    res.status((exception as HttpException).getStatus()).json(response)
  }
}
