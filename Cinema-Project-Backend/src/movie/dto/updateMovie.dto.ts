import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import dayjs from 'dayjs';

export class UpdateMovieDto {
  @ApiProperty({
    description: 'Movie Id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  movie_id: number;

  @ApiProperty({
    description: 'Movie name',
    example: 'Inception',
  })
  @IsString()
  @IsNotEmpty()
  movie_name: string;

  @ApiProperty({
    description: 'Trailer URL',
    example: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  })
  @IsNotEmpty()
  trailer: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image URL',
  })
  image: any;

  @ApiProperty({
    description: 'Movie description',
    example:
      'A thief who steals corporate secrets through the use of dream-sharing technology.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Opening date',
    example: '2010-07-16 00:00:00',
  })
  @Transform(({ value }) => {
    const date = dayjs(value, 'DD-MM-YYYY HH:mm:ss').toDate();
    return date;
  })
  @IsDate()
  @IsNotEmpty()
  opening_date: string;

  @ApiProperty({ description: 'Rating', example: 9 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  rate: number;

  @ApiProperty({ description: 'Is hot', example: true })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  hot: boolean;

  @ApiProperty({ description: 'Is now showing', example: false })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  now_showing: boolean;

  @ApiProperty({ description: 'Is coming soon', example: false })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  coming_soon: boolean;
}
