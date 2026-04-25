import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

export class MovieDto {
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
  @IsUrl()
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
    example: 'A thief who steals corporate secrets',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Opening date',
    example: '16-07-2026 00:00:00',
  })
  @Transform(({ value }) => {
    const date = dayjs(value, 'DD-MM-YYYY HH:mm:ss').toDate();
    return date;
  })
  @IsDate()
  @IsNotEmpty()
  opening_date: Date;

  @ApiProperty({ description: 'Rating', example: 9 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @ApiProperty({ description: 'Is hot', example: true })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsNotEmpty()
  hot: boolean;

  @ApiProperty({ description: 'Is now showing', example: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsNotEmpty()
  now_showing: boolean;

  @ApiProperty({ description: 'Is coming soon', example: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsNotEmpty()
  coming_soon: boolean;
}
