import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Banner, Movie } from 'src/generated/prisma/client';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/updateMovie.dto';
import path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { GetMovieByDateDto } from './dto/getMovieByDate.dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  // Get list movie banner
  async getBanner(): Promise<Banner[]> {
    return await this.prisma.banner.findMany();
  }

  // Get list of all movie
  async getAllMovie(): Promise<Movie[]> {
    return await this.prisma.movie.findMany();
  }

  // Get list of all movie pagination
  async getAllMoviePagination(
    index: number,
    page_size: number,
  ): Promise<Movie[]> {
    const skip = (index - 1) * page_size;
    return await this.prisma.movie.findMany({
      skip,
      take: page_size,
    });
  }

  // Get list of all movie based on date
  async getAllMoviePaginationByDate(
    @Body() body: GetMovieByDateDto,
  ): Promise<Movie[]> {
    const query: any = {};

    if (body.movie_name) {
      query.movie_name = {
        contains: body.movie_name,
      };
    }

    if (body.to_date && body.from_date) {
      query.opening_date = {
        gte: body.from_date,
        lte: body.to_date,
      };
    }

    if (body.index && body.page_size) {
      const skip = (body.index - 1) * body.page_size;
      return this.prisma.movie.findMany({
        where: query,
        skip,
        take: body.page_size,
      });
    }

    return this.prisma.movie.findMany({
      where: query,
    });
  }

  //Add new movie
  async addNewMovie(
    data: MovieDto,
    image: Express.Multer.File,
  ): Promise<Movie> {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }

    const webPath = 'public/compress/img';
    const outputDir = path.join(process.cwd(), webPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const baseName = path.parse(image.originalname).name;
    const timestamp = Date.now();
    const fileName = `${baseName}-${timestamp}.webp`;
    const outputPath = path.join(outputDir, fileName);

    await sharp(image.buffer).webp({ quality: 75 }).toFile(outputPath);

    data.image = `http://localhost:8080/${webPath}/${fileName}`;

    return this.prisma.movie.create({
      data,
    });
  }
  //Update movie
  async updateMovie(
    data: UpdateMovieDto,
    image: Express.Multer.File,
  ): Promise<Movie | null> {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }
    const { movie_id, ...updateData } = data;
    const findMovie = await this.prisma.movie.findUnique({
      where: {
        movie_id,
      },
    });

    if (!findMovie) {
      throw new Error('Movie not found');
    }

    const webPath = 'public/compress/img';
    const outputDir = path.join(process.cwd(), webPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const baseName = path.parse(image.originalname).name;
    const timestamp = Date.now();
    const fileName = `${baseName}-${timestamp}.webp`;
    const outputPath = path.join(outputDir, fileName);

    await sharp(image.buffer).webp({ quality: 75 }).toFile(outputPath);

    updateData.image = `http://localhost:8080/${webPath}/${fileName}`;

    try {
      const updateMovie = await this.prisma.movie.update({
        data: updateData,
        where: {
          movie_id,
        },
      });
      return updateMovie;
    } catch (error) {
      throw new BadRequestException(
        'This movie name already exists. Please choose a different name.',
      );
    }
  }

  // Delete movie
  async deleteMovie(movie_id: number, user: any): Promise<Movie | any> {
    const { user_type } = user.data;
    if (user_type !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to do this action',
      );
    }
    const findMovie = await this.prisma.movie.findUnique({
      where: {
        movie_id,
      },
    });

    if (!findMovie) {
      throw new NotFoundException('Movie not found');
    }
    const deleteMovie = await this.prisma.movie.delete({
      where: {
        movie_id,
      },
    });
    return deleteMovie;
  }

  // Get information of movie by movie id
  async findMovieInfo(movie_id: number): Promise<Movie | null> {
    const findMovie = await this.prisma.movie.findUnique({
      where: {
        movie_id,
      },
    });
    return findMovie;
  }
}
