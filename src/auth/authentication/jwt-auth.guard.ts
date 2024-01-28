import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Custom authentication logic
    const request = context.switchToHttp().getRequest()
    const { authorization } = request.headers
    if (authorization === undefined) {
      // 토큰이 전송되지 않았다면
      throw new UnauthorizedException()
    }
    return super.canActivate(context) // validate 적용
  }
  handleRequest(err: Error | null, user: any, info: any) {
    // Handle any authentication errors
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
