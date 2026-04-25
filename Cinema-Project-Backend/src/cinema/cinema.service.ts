import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  Cinema,
  CinemaChain,
  CinemaComplex,
} from 'src/generated/prisma/client';
import * as _ from 'lodash';

@Injectable()
export class CinemaService {
  constructor(private prisma: PrismaService) {}

  // Get cinema chain information
  async getCinemaChainInfo(cinema_chain_id: number): Promise<CinemaChain[]> {
    if (!cinema_chain_id) return this.prisma.cinemaChain.findMany();
    return this.prisma.cinemaChain.findMany({
      where: {
        cinema_chain_id,
      },
    });
  }

  // Get cinema complex information
  async getCinemaComplexInfo(cinema_chain_id: number): Promise<any> {
    if (!cinema_chain_id) {
      const rawResponse = await this.prisma.cinemaComplex.findMany({
        select: {
          cinema_complex_id: true,
          cinema_complex_name: true,
          address: true,
          CinemaList: {
            select: {
              cinema_id: true,
              cinema_name: true,
            },
          },
        },
      });
    }

    const rawResponse = await this.prisma.cinemaComplex.findMany({
      where: {
        cinema_chain_id,
      },

      select: {
        cinema_complex_id: true,
        cinema_complex_name: true,
        address: true,
        CinemaList: {
          select: {
            cinema_id: true,
            cinema_name: true,
          },
        },
      },
    });

    if (!rawResponse) return null;
    return rawResponse;
  }

  //Get showtimes based on cinema complex name
  async getShowTimesInfoOnCinemaChainId(cinema_chain_id: number): Promise<any> {
    const chainData = await this.prisma.cinemaChain.findUnique({
      where: {
        cinema_chain_id: cinema_chain_id,
      },
      include: {
        CinemaComplex: {
          include: {
            CinemaList: {
              include: {
                ShowTimes: {
                  include: {
                    Movie: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!chainData) {
      return null;
    }

    const formmatedData = {
      cinema_chain_id: chainData.cinema_chain_id,
      cinema_chain_name: chainData.cinema_chain_name,
      logo: chainData.logo,
      lstCinemaComplex: _.map(chainData.CinemaComplex, (complex) => ({
        cinema_complex_id: complex.cinema_complex_id,
        cinema_complex_name: complex.cinema_complex_name,
        address: complex.address,
        moviesInComplex: _.chain(complex.CinemaList)
          .flatMap((cinema) =>
            _.map(cinema.ShowTimes, (st) => ({
              ...st,
              cinema_id: cinema.cinema_id,
              cinema_name: cinema.cinema_name,
            })),
          )
          .groupBy('movie_id')
          .map((showTimes) => ({
            movie_id: showTimes[0].Movie?.movie_id,
            movie_name: showTimes[0].Movie?.movie_name,
            image: showTimes[0].Movie?.image,
            lstShowTimesOnMovie: _.map(showTimes, (st) => ({
              showtimes_id: st.showtimes_id,
              cinema_id: st.cinema_id,
              cinema_name: st.cinema_name,
              screening_time: st.screening_time,
              ticket_price: st.ticket_price,
            })),
          }))
          .value(),
      })),
    };
    return formmatedData;
  }

  //Get showtimes based on movie name
  async getShowTimesInfoOnMovieId(movie_id: number): Promise<any> {
    const movieData = await this.prisma.movie.findUnique({
      where: {
        movie_id,
      },
    });
    if (!movieData) {
      return null;
    }
    const rawShowTimes = await this.prisma.showTimes.findMany({
      where: {
        movie_id,
      },
      include: {
        Movie: true,
        Cinema: {
          include: {
            CinemaComplex: {
              include: {
                CinemaChain: true,
              },
            },
          },
        },
      },
    });

    if (!rawShowTimes) return null;

    // use lodash to format response
    const formattedCinemaChain = _.chain(rawShowTimes)
      .groupBy('Cinema.CinemaComplex.CinemaChain.cinema_chain_id')
      .map((chainGroup) => {
        const cinemaChain = chainGroup[0].Cinema?.CinemaComplex?.CinemaChain;
        const cinemaComplexesList = _.chain(chainGroup)
          .groupBy('Cinema.CinemaComplex.cinema_complex_id')
          .map((complexGroup) => {
            const cinemaComplexItem = complexGroup[0].Cinema?.CinemaComplex;

            const showTimesList = complexGroup.map((st) => ({
              showtimesId: st.showtimes_id,
              cinemaId: st.cinema_id,
              cinemaName: st.Cinema?.cinema_name,
              screeningTime: st.screening_time,
              ticketPrice: st.ticket_price,
              duration: 120,
            }));
            return {
              cinemaComplexId: cinemaComplexItem?.cinema_complex_id,
              cinemaComplexName: cinemaComplexItem?.cinema_complex_name,

              address: cinemaComplexItem?.address,
              showTimes: showTimesList,
            };
          })
          .value();
        return {
          cinemaChainId: cinemaChain?.cinema_chain_id,
          cinemaChainName: cinemaChain?.cinema_chain_name,
          logo: cinemaChain?.logo,
          complexesCinema: cinemaComplexesList,
        };
      })
      .value();
    return {
      ...movieData,
      CinemaChain: formattedCinemaChain,
    };
  }

  // Get cinema list based on cinema complex id
  async getCinemaListOnCinemaComplexId(
    cinema_complex_id: number,
  ): Promise<Cinema[]> {
    return this.prisma.cinema.findMany({
      where: {
        cinema_complex_id,
      },
    });
  }
}
