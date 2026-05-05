import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaChain, CinemaComplex } from 'src/generated/prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwtAuthGuard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}
  // Get cinema chain information
  @Get('/get-cinema-chain-info')
  @ApiQuery({ name: 'CinemaChainId', required: false, type: Number })
  async getCinemaChainInfo(
    @Query('CinemaChainId') cinema_chain_id: number,
  ): Promise<CinemaChain[]> {
    return await this.cinemaService.getCinemaChainInfo(+cinema_chain_id);
  }

  // Get cinema complex information
  @Get('/get-cinema-complex-info')
  @ApiQuery({ name: 'CinemaChainId', required: false, type: Number })
  async getCinemaComplexInfo(
    @Query('CinemaChainId') cinema_chain_id: number,
  ): Promise<CinemaComplex[]> {
    return this.cinemaService.getCinemaComplexInfo(+cinema_chain_id);
  }

  //Get showtimes based on cinema complex Id
  @Get('/get-showtimes-info-on-cinema-chain-id')
  @ApiQuery({ name: 'CinemaChainId', required: false, type: Number })
  async getShowTimesInfoOnCinemaChainId(
    @Query('CinemaChainId') cinema_chain_id: number,
  ): Promise<any> {
    return this.cinemaService.getShowTimesInfoOnCinemaChainId(+cinema_chain_id);
  }

  //Get showtimes based on movie Id
  @Get('/get-showtimes-info-on-movie-id')
  @ApiQuery({ name: 'MovieId', required: false, type: Number })
  async getShowTimesInfoOnMovieId(
    @Query('MovieId') movie_id: number,
  ): Promise<any> {
    return this.cinemaService.getShowTimesInfoOnMovieId(+movie_id);
  }

  // Get cinema list based on cinema complex id
  @Get('/get-cinema-list-on-cinema-complex-id')
  @ApiQuery({ name: 'CinemaComplexId', required: true, type: Number })
  async getCinemaListOnCinemaComplexId(
    @Query('CinemaComplexId') cinema_complex_id: number,
  ): Promise<any> {
    return this.cinemaService.getCinemaListOnCinemaComplexId(
      +cinema_complex_id,
    );
  }
}


