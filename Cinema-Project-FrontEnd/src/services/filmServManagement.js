import { https } from "./configServ";

export const filmServManagement = {
  getAllBanner: () => {
    return https.get("/movie/get-banner");
  },
  getAllMovie: () => {
    return https.get("/movie/get-all-movie");
  },
  deleteMovie: (movieCode) => {
    return https.delete(`/movie/delete-movie?movie_id=${movieCode}`);
  },
  addMovie: (data) => {
    return https.post("/movie/add-new-movie", data);
  },
  getCinemaShowTime: (cinemaCode) => {
    return https.get(
      `cinema/get-showtimes-info-on-cinema-chain-id?CinemaChainId=${cinemaCode}`,
    );
  },
  getMovieList: () => {
    return https.get("/movie/get-all-movie");
  },
  getMovieInfo: (movieId) => {
    return https.get(`/movie/get-movie-info?movie_id=${movieId}`);
  },
  updateMovieInfo: (data) => {
    return https.post("/movie/update-movie", data);
  },
};
