import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { userLoginDto } from './dto/userLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { userRegisterDto } from './dto/userRegister.dto';
import bcrypt from 'bcrypt';
import { AddUserDto } from './dto/addUser.dto';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Login
  async userLogin(data: userLoginDto): Promise<any> {
    const { email, password } = data;
    const findUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (findUser) {
      if (bcrypt.compareSync(password, findUser.password)) {
        const token = await this.jwtService.signAsync(
          {
            data: {
              account_id: findUser.account_id,
              user_type: findUser.user_type,
            },
          },
          {
            expiresIn: '50m',
            secret: this.config.get('JWT_SECRET'),
            algorithm: 'HS256',
          },
        );
        return {
          content: {
            ...findUser,
            token,
          },
        };
      } else {
        throw new UnauthorizedException('Wrong Password!');
      }
    } else {
      throw new UnauthorizedException('Wrong Email!');
    }
  }

  // User Register
  async userRegister(data: userRegisterDto): Promise<User> {
    data.password = bcrypt.hashSync(data.password, 10);
    return await this.prisma.user.create({
      data,
    });
  }

  // Get List of User Type based on type
  async getListTypeUser(user_type: string): Promise<User[] | null> {
    const userType = user_type.toLowerCase();
    const findUser = await this.prisma.user.findMany({
      where: {
        user_type: userType,
      },
    });
    if (findUser.length === 0)
      throw new NotFoundException('There is no that customer type!');
    return findUser;
  }

  // Get list of all user
  async getUserList(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  //Get list of all user based on pagination
  async getUserListPagination(
    index: number,
    page_size: number,
  ): Promise<User[]> {
    const page_index = (index - 1) * page_size;
    return this.prisma.user.findMany({
      take: page_size,
      skip: page_index,
    });
  }

  // Find user based on key
  async getUserInfo(key: string): Promise<User[]> {
    if (!key) {
      return this.prisma.user.findMany();
    }
    const searchString = key.toLowerCase().trim();
    const accountId = parseInt(searchString, 10);

    const conditions: any[] = [
      { name: { contains: searchString } },
      { email: { contains: searchString } },
      { phone_number: { contains: searchString } },
      { user_type: { contains: searchString } },
    ];
    if (!isNaN(accountId)) {
      conditions.push({ account_id: accountId });
    }
    return this.prisma.user.findMany({
      where: {
        OR: conditions,
      },
    });
  }

  async getUserInfoPagination(
    key: string,
    index: number,
    page_size: number,
  ): Promise<User[]> {
    if (!key) {
      return this.prisma.user.findMany();
    }
    const searchString = key.toLowerCase().trim();
    const accountId = parseInt(searchString, 10);

    const conditions: any[] = [
      { name: { contains: searchString } },
      { email: { contains: searchString } },
      { phone_number: { contains: searchString } },
      { user_type: { contains: searchString } },
    ];
    if (!isNaN(accountId)) {
      conditions.push({ account_id: accountId });
    }
    const page_index = (index - 1) * page_size;

    return this.prisma.user.findMany({
      where: {
        OR: conditions,
      },
      take: page_size,
      skip: page_index,
    });
  }

  // Get user info based on token (need to fix later)
  async getAccountInfo(user: any, query_account_id: number): Promise<any> {
    const { user_type } = user.data;

    if (user_type !== 'admin') {
      throw new ForbiddenException(
        'You are not an admin to perform this request!',
      );
    }
    const rawfindUser = await this.prisma.user.findUnique({
      where: {
        account_id: query_account_id,
      },
      include: {
        Booking: {
          include: {
            Seat: {
              include: {
                Cinema: {
                  include: {
                    CinemaComplex: {
                      include: {
                        CinemaChain: true,
                      },
                    },
                  },
                },
              },
            },
            ShowTimes: {
              include: {
                Movie: true,
              },
            },
          },
        },
      },
    });

    const response = {
      account_id: rawfindUser?.account_id,
      email: rawfindUser?.email,
      name: rawfindUser?.name,
      phone_number: rawfindUser?.phone_number,
      user_type: rawfindUser?.user_type,
      BookingInfo: _.chain(rawfindUser?.Booking)
        .groupBy('showtimes_id')
        .map((bookingGroup, showtimesId) => {
          const firstBooking = bookingGroup[0];

          const seatsList = bookingGroup.map((bookingItem) => ({
            cinema_chain_id:
              bookingItem.Seat.Cinema?.CinemaComplex?.CinemaChain
                ?.cinema_chain_id,
            cinema_chain_name:
              bookingItem.Seat.Cinema?.CinemaComplex?.CinemaChain
                ?.cinema_chain_name,
            cinema_complex_id:
              bookingItem.Seat.Cinema?.CinemaComplex?.cinema_complex_id,
            cinema_complex_name:
              bookingItem.Seat.Cinema?.CinemaComplex?.cinema_complex_name,
            cinema_id: bookingItem.Seat.Cinema?.cinema_id,
            cinema_name: bookingItem.Seat.Cinema?.cinema_name,
            seat_id: bookingItem.Seat.seat_id,
            seat_name: bookingItem.Seat.seat_name,
          }));
          return {
            seatsList,
            ticket_id: firstBooking.ticket_id,
            bookingDate: firstBooking.date,
            movieName: firstBooking.ShowTimes?.Movie?.movie_name,
            image: firstBooking.ShowTimes?.Movie?.image,
            ticket_price: firstBooking.ShowTimes?.ticket_price,
            movie_duration: 120,
          };
        })
        .value(),
    };

    return response;
  }

  // Add user
  async addUser(user: any, data: AddUserDto): Promise<User> {
    const { user_type } = user.data;
    if (user_type === 'admin') {
      return this.prisma.user.create({
        data,
      });
    } else {
      throw new ForbiddenException(
        'You are not an admin to perform this request!',
      );
    }
  }

  // Update user
  async updateUser(user: any, data: any): Promise<any> {
    const { user_type } = user.data;
    const { account_id, email, BookingInfo, ...updateData } = data;

    const findUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!findUser) throw new NotFoundException('No user found!');

    if (data.password && data.password.trim() !== '') {
      updateData.password = bcrypt.hashSync(data.password, 10);
    } else {
      if (!findUser.password) {
        throw new BadRequestException('User password is invalid!');
      }
      delete updateData.password;
    }
    if (user_type === 'admin') {
      return this.prisma.user.update({
        where: {
          account_id: findUser.account_id,
        },
        data: updateData,
      });
    } else {
      throw new ForbiddenException(
        'You are not an admin to perform this request!',
      );
    }
  }

  // Delete user
  async deleteUser(user: any, account_id: number): Promise<User> {
    const { user_type } = user.data;
    if (user_type === 'admin') {
      const deletUser = await this.prisma.user.delete({
        where: {
          account_id,
        },
      });
      return deletUser;
    } else {
      throw new ForbiddenException(
        'You are not an admin to perform this request!',
      );
    }
  }
}
