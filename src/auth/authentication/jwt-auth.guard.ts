import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)
  canActivate(context: ExecutionContext) {
    // Custom authentication logic
    const request = context.switchToHttp().getRequest()
    const { authorization } = request.headers
    if (authorization === undefined) {
      // 토큰이 전송되지 않았다면
      this.logger.warn('Authorization header is missing')
      throw new UnauthorizedException('Authorization token is missing')
    }
    return super.canActivate(context) // validate 적용
  }
  handleRequest(err: Error | null, user: any, info: any) {
    // Handle any authentication errors
    if (err || !user) {
      if (err) {
        this.logger.error('Authentication error', err.stack)
      } else {
        this.logger.warn('User not found or token is invalid', info?.message || '')
      }
      throw err || new UnauthorizedException(info?.message || 'Unauthorized')
    }
    return user
  }
}
