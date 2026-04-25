import { https } from "./configServ";

export const cinemaSchedule = {
  getAllCinema: () => {
    return https.get("/cinema/get-cinema-chain-info");
  },
  getMovieShowTime: (movieCode) => {
    return https.get(
      `/cinema/get-showtimes-info-on-movie-id?MovieId=${movieCode}`,
    );
  },
  getShowTimeSeat: (showTimeCode) => {
    return https.get(
      `/booking/get-show-time-ticket?ShowTimeId=${showTimeCode}`,
    );
  },
  bookTicket: (data) => {
    return https.post("/booking/booking-ticket", data);
  },

  getClusterInfoBySystem: (clusterId) => {
    return https.get(
      `/cinema/get-cinema-complex-info?CinemaChainId=${clusterId}`,
    );
  },

  getCinemaListByCinemaComplexId: (complexId) => {
    return https.get(
      `cinema/get-cinema-list-on-cinema-complex-id?CinemaComplexId=${complexId}`,
    );
  },

  createShowTime: (data) => {
    return https.post("booking/create-show-time", data);
  },
};
