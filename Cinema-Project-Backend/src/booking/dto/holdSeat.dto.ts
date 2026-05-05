import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class HoldSeatDto {
  @ApiProperty({ description: 'Showtimes Id', example: 1 })
  @Type(() => Number)
  @IsNumber()
  showtimes_id: number;

  @ApiProperty({ description: 'Seat Id', example: 120 })
  @Type(() => Number)
  @IsNumber()
  seat_id: number;
}
