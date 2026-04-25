export const reviewServ = {
  fetchPopularData: async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_THE_MOVIEDB_AUTHORIZATION_TOKEN}`,
      },
      cache: "no-store",
    };

    return fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((json) => {
        return json;
      })
      .catch((err) => console.error(err));
  },
  fetchUserReviewBasedOnFilmId: async (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_THE_MOVIEDB_AUTHORIZATION_TOKEN}`,
      },
      cache: "no-store",
    };

    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        return json;
      })
      .catch((err) => console.error(err));
  },
};
