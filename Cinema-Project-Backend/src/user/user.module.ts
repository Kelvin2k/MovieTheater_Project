import { JwtStrategy } from './../jwt.strategy';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/Authenticate/token.module';

@Module({
  imports: [JwtModule.register({}), TokenModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
