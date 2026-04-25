import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketItemDto {
  @ApiProperty({ description: 'Seat Id', example: 47433 })
  @Type(() => Number)
  @IsNumber()
  seat_id: number;

  @ApiProperty({ description: 'Seat Price', example: 90000 })
  @Type(() => Number)
  @IsNumber()
  ticket_price: number;
}
