import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async createAuthenticationToken(): Promise<string> {
    const expireTime = new Date().getTime() + 100 * 24 * 60 * 60 * 1000;
    const token = await this.jwtService.signAsync(
      {
        data: {
          user_type: 'admin',
          expireTime,
          expireString: dayjs(expireTime).format('DD/MM/YYYY'),
        },
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '100d',
        algorithm: 'HS256',
      },
    );
    return token;
  }
  async validateToken(token: string): Promise<any> {
    const validate = this.jwtService.decode(token);
    console.log(validate);

    return validate;
  }
}
