import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class userLoginDto {
  @ApiProperty({
    description: 'Email of user',
    example: 'admin2@gmail.com',
  })
  @IsEmail({}, { message: 'Email is not in right format!' })
  @IsString()
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  email: string;

  @ApiProperty({
    description: 'Password of user',
    example: '123',
  })
  @IsNotEmpty({ message: 'Please do not leave this field empty!' })
  @IsString()
  password: string;
}
