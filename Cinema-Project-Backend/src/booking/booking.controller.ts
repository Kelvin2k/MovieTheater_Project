import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingTicketDto } from './dto/bookingTicket.dto';
import { Seat, ShowTimes } from 'src/generated/prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import type { Request } from 'express';
import { CreateShowTimeDto } from './dto/createShowTime.dto';
import { TokenService } from 'src/Authenticate/token.service';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly tokenService: TokenService,
  ) {}
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('/booking-ticket')
  async bookingTicket(
    @Body() data: BookingTicketDto,
    @Headers('Token') token: string,
  ): Promise<any> {
    const user = await this.tokenService.validateToken(token);
    return this.bookingService.bookingTicket(data, user);
  }

  // Fetch show time ticket
  @Get('/get-show-time-ticket')
  async getShowTimeBookingStatus(
    @Query('ShowTimeId') showtimes_id: number,
  ): Promise<Seat[]> {
    return this.bookingService.getShowTimeBookingStatus(+showtimes_id);
  }

  // Create Show Time
  @Post('/create-show-time')
  async createShowTime(@Body() data: CreateShowTimeDto): Promise<ShowTimes> {
    return await this.bookingService.createShowTime(data);
  }
}
