import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly sequelize: Sequelize) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const httpContext = context.switchToHttp()
    const req = httpContext.getRequest()
    const transaction: Transaction = await this.sequelize.transaction({
      logging: true,
    })
    req.transaction = transaction
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit()
      }),
      catchError(async err => {
        console.log('err:', err.original)
        await transaction.rollback()
        return throwError(() => err)
      })
    )
  }
}
