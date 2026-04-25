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
    console.log(account_id);

    console.log(data);

    const seatArr = data.ticket_list.map((item) => item.seat_id);
    const isExistBooking = await this.prisma.booking.findMany({
      where: {
        showtimes_id: data.showtimes_id,
        seat_id: { in: seatArr },
      },
    });
    if (isExistBooking.length > 0)
      throw new BadRequestException('Seats already taken!');

    const finalData = data.ticket_list.map((item) => ({
      account_id,
      showtimes_id: data.showtimes_id,
      seat_id: item.seat_id,
    }));

    const showTimesInfo = await this.prisma.showTimes.findUnique({
      where: {
        showtimes_id: data.showtimes_id,
      },
      include: {
        Movie: true,
        Cinema: {
          include: {
            CinemaComplex: {
              include: {
                CinemaChain: true,
              },
            },
            Seat: true,
          },
        },
      },
    });
    if (!showTimesInfo) throw new Error('Can not find this show time!');
    console.log(showTimesInfo);

    const bookingTicket = await this.prisma.booking.createMany({
      data: finalData,
      skipDuplicates: true,
    });
    if (bookingTicket) return 'Book Ticket Successfully';
    throw new Error('Bad Request!');
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
    // const formatDateTime = dayjs(data.screening_time).format(
    //   'DD/MM/YYYY HH:mm:ss',
    // );
    return this.prisma.showTimes.create({
      data,
    });
  }
}
