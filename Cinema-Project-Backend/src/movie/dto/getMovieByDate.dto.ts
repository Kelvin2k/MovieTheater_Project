import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetMovieByDateDto {
  @ApiProperty({
    description: 'Movie Name',
    example: 'Spider-Man',
    required: false,
  })
  @IsString()
  movie_name?: string;

  @ApiProperty({
    description: 'Index of item',
    example: '3',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  index: number;

  @ApiProperty({
    description: 'Page Size',
    example: '2',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  page_size: number;

  @ApiProperty({
    description: 'From Date',
    example: '15-03-2020 or 15/03/2020',
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return value;
    const parts = value.split(/[-/]/);
    return new Date(Number(parts[2]), Number(parts[1] - 1), Number(parts[0]));
  })
  @IsDate()
  from_date: Date;

  @ApiProperty({
    description: 'To Date',
    example: '15-03-2026 or 15/03/2026',
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return value;
    const parts = value.split(/[-/]/);
    return new Date(Number(parts[2]), Number(parts[1] - 1), Number(parts[0]));
  })
  @IsDate()
  to_date: Date;
}
