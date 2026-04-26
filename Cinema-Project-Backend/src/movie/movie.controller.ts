import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import type { Banner, Movie } from 'src/generated/prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/updateMovie.dto';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { GetMovieByDateDto } from './dto/getMovieByDate.dto';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { TokenService } from 'src/Authenticate/token.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movie')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly tokenService: TokenService,
  ) {}
  // Get list movie banner
  @Get('get-banner')
  async getBanner(): Promise<Banner[]> {
    return await this.movieService.getBanner();
  }
  // Get list of all movie
  @Get('/get-all-movie')
  async getAllMovie(): Promise<Movie[]> {
    return await this.movieService.getAllMovie();
  }

  // Get list of all movie pagination
  @Get('get-all-movie-pagination')
  async getAllMoviePagination(
    @Query('index') index: number,
    @Query('Page Size') page_size: number,
  ): Promise<Movie[]> {
    return await this.movieService.getAllMoviePagination(+index, +page_size);
  }

  // Get list of all movie based on date
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({ type: GetMovieByDateDto })
  @Post('get-all-movie-by-date-pagination')
  async getAllMoviePaginationByDate(
    @Body() body: GetMovieByDateDto,
  ): Promise<Movie[]> {
    return this.movieService.getAllMoviePaginationByDate(body);
  }

  // add a new movie
  @Post('/add-new-movie')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MovieDto })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: Math.pow(1024, 2) * 5 },
    }),
  )
  async addNewMovie(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: MovieDto,
  ): Promise<Movie> {
    return await this.movieService.addNewMovie(data, file);
  }

  // update a new movie
  @Post('/update-movie')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMovieDto })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  async updateMovie(
    @Body() data: UpdateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Movie | null> {
    return await this.movieService.updateMovie(data, file);
  }

  // delete movie information
  @Delete('/delete-movie/')
  async deleteMovie(
    @Query('movie_id') movie_id: number,
    @Headers('Token') token: string,
  ) {
    const user = await this.tokenService.validateToken(token);
    return await this.movieService.deleteMovie(+movie_id, user);
  }

  // find an information of a specific movie
  @Get('/get-movie-info/')
  async findMovieInfo(@Query('movie_id') movie_id: number) {
    return await this.movieService.findMovieInfo(+movie_id);
  }
}
