import React from "react";
import Banner from "./Banner";
import CinemaSchedule from "./CinemaSchedule";
import HotMovie from "./HotMovie";
import MovieReviews from "./MovieReviews";


const HomePage = () => {

  return (
    <div>
      <Banner />
      <div className="container mx-auto">
        <HotMovie />
        <CinemaSchedule />
        <MovieReviews />
      </div>  
    </div>
  );
};

export default HomePage;
