import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export class CreateShowTimeDto {
  @ApiProperty({ description: 'Movie Code', example: 1 })
  @Type(() => Number)
  @IsNumber()
  movie_id: number;

  @ApiProperty({ description: 'Release Date', example: '25-03-2026 17:00:00' })
  @Transform(({ value }) => {
    const date = dayjs(value, 'DD-MM-YYYY HH:mm:ss').toDate();
    return date;
  })
  @IsDate()
  screening_time: Date;

  @ApiProperty({ description: 'Cinema Id', example: 1 })
  @Type(() => Number)
  @IsNumber()
  cinema_id: number;

  @ApiProperty({ description: 'Ticket Price', example: 1 })
  @Type(() => Number)
  @IsNumber()
  ticket_price: number;
}
