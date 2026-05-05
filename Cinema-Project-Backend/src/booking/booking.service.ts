import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BookingTicketDto } from './dto/bookingTicket.dto';
import { Seat, ShowTimes } from 'src/generated/prisma/client';
import dayjs from 'dayjs';
import { CreateShowTimeDto } from './dto/createShowTime.dto';
import * as _ from 'lodash';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  //Booking Ticket
  async bookingTicket(data: BookingTicketDto, user: any): Promise<any> {
    const { account_id } = user.data;
    const seatArr = data.ticket_list.map((item) => item.seat_id);
    const now = new Date();

    const confirmBooking = await this.prisma.booking.updateMany({
      where: {
        showtimes_id: data.showtimes_id,
        seat_id: { in: seatArr },
        account_id: account_id,
        status: 'HELD',
        hold_until: { gt: now },
      },
      data: {
        status: 'BOOKED',
        hold_until: null,
        date: new Date(),
        version: { increment: 1 },
      },
    });

    if (confirmBooking.count !== seatArr.length) {
      throw new BadRequestException(
        'Checkout failed. Session expired or invalid seats.',
      );
    }

    return true;
  }

  // fetch show time ticket
  async getShowTimeBookingStatus(showtimes_id: number): Promise<any> {
    const showTimeInfo = await this.prisma.showTimes.findUnique({
      where: { showtimes_id },
      include: {
        Movie: true,
        Cinema: {
          include: {
            CinemaComplex: true,
          },
        },
      },
    });
    if (!showTimeInfo) {
      throw new Error('Can not find this show time!');
    }
    const rawSeats = await this.prisma.seat.findMany({
      where: {
        cinema_id: showTimeInfo.cinema_id,
      },
      include: {
        Booking: {
          where: {
            showtimes_id,
          },
          include: {
            User: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        seat_id: 'asc',
      },
    });

    const seatsList = rawSeats.map((item) => {
      return {
        seat_id: item.seat_id,
        seat_name: item.seat_name,
        seat_type: item.seat_type,
        cinema_id: item.cinema_id,
        seat_price: item.seat_price,
        isBooked: item.Booking.length > 0,
        userName: item.Booking.length > 0 ? item.Booking[0].User.name : null,
      };
    });

    const movieInfoResponse = {
      showtimes_id: showTimeInfo.showtimes_id,
      cinema_complex_name:
        showTimeInfo.Cinema?.CinemaComplex?.cinema_complex_name,
      cinema_name: showTimeInfo.Cinema?.cinema_name,
      address: showTimeInfo.Cinema?.CinemaComplex?.address,
      movie_name: showTimeInfo.Movie?.movie_name,
      image: showTimeInfo.Movie?.image,
      opening_date: dayjs(showTimeInfo.Movie?.opening_date).format(
        'DD/MM/YYYY',
      ),
      screening__time: dayjs(showTimeInfo.screening_time).format('HH:MM'),
    };

    return {
      movieInfo: movieInfoResponse,
      seatsList,
    };
  }

  // Create Show Time
  async createShowTime(data: CreateShowTimeDto): Promise<ShowTimes> {
    return this.prisma.showTimes.create({
      data,
    });
  }

  // Held Booking Seat
  async heldBookingSeat(
    showtimes_id: number,
    seat_id: number,
    account_id: number,
  ): Promise<any> {
    const holdDuration = 5 * 60 * 1000;
    const expirationDate = new Date(Date.now() + holdDuration);

    // 1. Check if this seat already exists in the database
    const existingBooking = await this.prisma.booking.findFirst({
      where: { showtimes_id, seat_id },
    });

    // Case 1: The seat is completely empty (No one has clicked yet)
    if (!existingBooking) {
      try {
        const newHold = await this.prisma.booking.create({
          data: {
            showtimes_id,
            seat_id,
            account_id,
            status: 'HELD',
            hold_until: expirationDate,
            version: 1,
          },
        });
        return { message: 'Hold seat successfully!', data: newHold };
      } catch (error) {
        // Race Condition Handling
        throw new BadRequestException(
          'This seat has been selected by other customer',
        );
      }
    }

    // Case 2: seat has been sell
    if (existingBooking.status === 'BOOKED') {
      throw new BadRequestException('This seat has been purchased!');
    }

    // Case 3: Seat is held
    if (existingBooking.status === 'HELD') {
      const now = new Date();
      const holdUntil = existingBooking.hold_until;

      // 3A. If the seat is still being held (hold time not expired)
      if (holdUntil !== null && holdUntil > now) {
        // If the same user clicks again on the seat they are holding
        if (existingBooking.account_id === account_id) {
          return { message: 'You are holding this seat!' };
        }
        throw new BadRequestException(
          'This seat is being processed for payment, please choose another one!',
        );
      }

      // 3B. If the hold time has expired (hold_until < now) -> Steal the seat (OCC)
      const stealSeat = await this.prisma.booking.updateMany({
        where: {
          showtimes_id,
          seat_id,
          status: 'HELD',
          version: existingBooking.version,
        },
        data: {
          account_id,
          hold_until: expirationDate,
          version: { increment: 1 },
        },
      });

      if (stealSeat.count === 0) {
        throw new BadRequestException('Seat has been selected!');
      }

      return true;
    }
  }
}
