import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { TicketItemDto } from './ticketItem.dto';

export class BookingTicketDto {
  @ApiProperty({ description: 'Show Time Id', example: '1' })
  @Type(() => Number)
  @IsNumber()
  showtimes_id: number;

  @ApiProperty({
    description: 'Seat Id',
    type: [TicketItemDto],
    example: [{ seat_id: 1, ticket_price: 20 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketItemDto)
  ticket_list: TicketItemDto[];
}
