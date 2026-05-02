import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { filmServManagement } from "../../services/filmServManagement";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./hotMovie.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { endedLoading, startedLoading } from "../../redux/Slice/loadingSlice";

const HotMovie = () => {
  const [hotMovie, setHotMovie] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const dispatch = useDispatch();

  const handlePlayClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  useEffect(() => {
    dispatch(startedLoading());
    filmServManagement
      .getMovieList()
      .then((result) => {
        setHotMovie(result.data);
        dispatch(endedLoading());
      })
      .catch((err) => {
        dispatch(endedLoading());
      });
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1281,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="" id="hot_movie">
      <h2 className="text-3xl md:text-5xl text-center font-bold uppercase text-red-500 my-5">
        Hot Movies
      </h2>
      <Slider {...settings}>
        {hotMovie?.map((movie, index) => {
          return (
            <div key={movie.movie_id} className="px-2">
              <div className="relative rounded-lg overflow-hidden">
                <div
                  className="cover absolute top-0 left-0 w-full h-full bg-gray-900 hover:opacity-50 opacity-0 duration-300 cursor-pointer"
                  onClick={() => {
                    handlePlayClick(movie);
                  }}
                >
                  <div className="flex justify-center items-center w-full h-full">
                    <i className="fa-regular fa-circle-play text-5xl text-white"></i>
                  </div>
                </div>
                <img
                  src={`${process.env.REACT_APP_API_URL}${movie.image}`}
                  alt=""
                  className="h-50 w-full object-cover"
                />
              </div>
              <p className="my-4 font-bold hover:text-green-500 duration-300">
                <span className="text-white bg-red-500 rounded-sm px-2 py-2 mr-3">
                  C18
                </span>
                <Link
                  to={`/detail_movie/${movie.movie_id}`}
                  className="text-white hover:text-red-500 duration-200"
                >
                  {movie.movie_name}
                </Link>
              </p>
              <p className="description line-clamp-3 text-gray-300">
                {movie.description}
              </p>
              <div className="flex justify-center items-center md:block">
                <Link to={`/detail_movie/${movie.movie_id}`}>
                  <button className="bg-red-500 text-white px-4 py-2 rounded mt-5 cursor-pointer hover:bg-red-700 duration-300 mb-5 md:mb-0">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
      <Modal
        title={selectedMovie?.movie_name}
        open={isModalOpen}
        closable={{ "aria-label": "Custom Close Button" }}
        onCancel={handleCancel}
        width={800}
        centered
        footer={null}
        style={{ color: "white" }}
      >
        {selectedMovie && (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${
              selectedMovie.trailer.split("v=")[1]?.split("&")[0]
            }?autoplay=1`}
            title={selectedMovie.movie_name}
            allow="autoplay"
          ></iframe>
        )}
      </Modal>
    </div>
  );
};

export default HotMovie;
