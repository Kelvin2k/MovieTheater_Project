import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TokenModule } from 'src/Authenticate/token.module';

@Module({
  imports: [TokenModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
