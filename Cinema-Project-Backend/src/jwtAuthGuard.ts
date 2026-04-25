import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token has expired, please login again!',
        );
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token signature!');
      }

      throw new UnauthorizedException(info?.message || 'Unauthorized access!');
    }
    return user;
  }
}
