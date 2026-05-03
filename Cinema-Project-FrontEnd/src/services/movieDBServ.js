export const movieDBServ = {
  options: {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_THE_MOVIEDB_AUTHORIZATION_TOKEN}`,
    },
    cache: "no-store",
  },

  async requestData(url) {
    return fetch(url, this.options)
      .then((res) => res.json())
      .catch((err) => console.error(err));
  },

  // popular data movie
  async fetchPopularData() {
    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    return this.requestData(url);
  },

  // movie reviews
  async fetchUserReviewBasedOnFilmId(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`;
    return this.requestData(url);
  },

  // movie banners
  async fetchMovieBanner() {
    const url =
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    return this.requestData(url);
  },
};
