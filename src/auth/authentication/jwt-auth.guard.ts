import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Custom authentication logic
    return super.canActivate(context)
  }
  handleRequest(err, user, info) {
    // Handle any authentication errors
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
