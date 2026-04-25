import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AddUserDto {
  @ApiProperty({
    description: 'Name of user',
    example: 'Kelvin',
  })
  @IsString()
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  name: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'admin@gmail.com',
  })
  @IsEmail({}, { message: 'Email is not in right format!' })
  @IsString()
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  email: string;

  @ApiProperty({ description: 'Phone Number of User', example: '0450206335' })
  @IsPhoneNumber('AU', { message: 'Please provide a valid phone number!' })
  @IsNotEmpty({ message: 'Phone number is required!' })
  phone_number: string;

  @ApiProperty({
    description: 'Password of user',
    example: '1234',
  })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Type of User',
    example: 'customer',
  })
  @IsString()
  user_type: string;
}
