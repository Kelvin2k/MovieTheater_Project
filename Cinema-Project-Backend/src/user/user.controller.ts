import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/generated/prisma/client';
import { userLoginDto } from './dto/userLogin.dto';
import { userRegisterDto } from './dto/userRegister.dto';
import type { Request } from 'express';
import { ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { AddUserDto } from './dto/addUser.dto';
import { TokenService } from 'src/Authenticate/token.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  // Get List of User Type based on type
  @Get('/get-list-type-user')
  @ApiQuery({
    name: 'user_type',
    description: 'user_type',
    example: 'admin',
    required: false,
  })
  async getListTypeUser(
    @Query('user_type') user_type?: string,
  ): Promise<User[] | null> {
    return await this.userService.getListTypeUser(user_type || 'customer');
  }

  // User Login
  @Post('/user-login/')
  async userLogin(@Body() data: userLoginDto): Promise<string> {
    return await this.userService.userLogin(data);
  }

  // User Regiser
  @Post('user-register')
  async userRegister(@Body() data: userRegisterDto): Promise<User> {
    return await this.userService.userRegister(data);
  }

  // Get list of all user
  @Get('/get-all-user')
  async getUserList(): Promise<User[]> {
    return await this.userService.getUserList();
  }

  //Get list of all user based on pagination
  @Get('/get-all-user-pagination')
  async getUserListPagination(
    @Query('index') index: number,
    @Query('page_size') page_size: number,
  ): Promise<User[]> {
    return await this.userService.getUserListPagination(+index, +page_size);
  }

  // Find user based on key
  @Get('/get-user-info/')
  async getUserInfo(@Query('key') key: string): Promise<User[]> {
    return await this.userService.getUserInfo(key);
  }

  // Find user pagination based on key
  @Get('/get-user-info-pagination/:key/:index/:page_size')
  async getUserInfoPagination(
    @Param('key') key: string,
    @Query('index') index: number,
    @Query('page_size') page_size: number,
  ): Promise<User[]> {
    return await this.userService.getUserInfoPagination(
      key,
      +index,
      +page_size,
    );
  }

  // Get user info based on token
  @Post('/get-account-info')
  async getAccountInfo(
    @Query('AccountId') account_id: number,
    @Headers('Token') admin_token: string,
  ): Promise<any> {
    const user = await this.tokenService.validateToken(admin_token);

    return await this.userService.getAccountInfo(user, +account_id);
  }

  // Add user
  @Post('/add-user')
  async addUser(
    @Body() data: AddUserDto,
    @Headers('Token') admin_token: string,
  ): Promise<User> {
    const user = await this.tokenService.validateToken(admin_token);
    return await this.userService.addUser(user, data);
  }

  // Update user
  @Post('/update-user')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Headers('Token') adminToken: string,
  ): Promise<UpdateUserDto> {
    const user = await this.tokenService.validateToken(adminToken);

    return await this.userService.updateUser(user, data);
  }

  // Delete user
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete-user/')
  async deleteUser(
    @Req() req: Request,
    @Query('Account_Id') account_id: number,
    @Headers('Token') admin_token: string,
  ): Promise<User> {
    const user = await this.tokenService.validateToken(admin_token);
    return await this.userService.deleteUser(user, +account_id);
  }
}
