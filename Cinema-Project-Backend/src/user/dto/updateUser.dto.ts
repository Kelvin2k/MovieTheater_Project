import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Name of user',
    example: 'Kelvin',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'admin2@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email is not in right format!' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone Number of User',
    example: '0450207006',
    required: false,
  })
  @IsPhoneNumber('AU', { message: 'Please provide a valid phone number!' })
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'Password of user',
    example: '1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Type of user',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  user_type?: string;
}
