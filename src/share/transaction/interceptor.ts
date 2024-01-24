import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly sequelize: Sequelize) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const transaction: Transaction = await this.sequelize.transaction({
      logging: true,
    })
    req.transaction = transaction
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit()
      }),
      catchError(async err => {
        console.log('err:', err)
        await transaction.rollback()
        if (err instanceof HttpException) {
          throw new HttpException(err.getResponse(), err.getStatus())
        }
        throw new InternalServerErrorException()
      })
    )
  }
}
