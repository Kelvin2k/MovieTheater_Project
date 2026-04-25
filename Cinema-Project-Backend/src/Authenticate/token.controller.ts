import { Controller, Get, Param, Query } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('auth')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('/create-token')
  async createToken() {
    return await this.tokenService.createAuthenticationToken();
  }

  @Get('/test-token')
  async test(@Query('token') token: string): Promise<any> {
    return await this.tokenService.validateToken(token);
  }
}
