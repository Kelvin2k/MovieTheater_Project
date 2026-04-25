import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class userRegisterDto {
  @ApiProperty({ description: 'Name of User', example: 'admin@gmail.com' })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  name: string;

  @ApiProperty({ description: 'Email of User', example: 'admin@gmail.com' })
  @IsEmail({}, { message: 'Email is not in right format!' })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  email: string;

  @ApiProperty({ description: 'Phone Number of User', example: '0450206335' })
  @IsPhoneNumber('AU', { message: 'Please provide a valid phone number!' })
  @IsNotEmpty({ message: 'Phone number is required!' })
  phone_number: string;

  @ApiProperty({ description: 'Password of User', example: '1234' })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  password: string;

  @ApiProperty({ description: 'Type of User', example: 'customer' })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  user_type: string;
}
