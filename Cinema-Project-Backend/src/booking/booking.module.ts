import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TokenModule } from 'src/Authenticate/token.module';

@Module({
  imports: [TokenModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
