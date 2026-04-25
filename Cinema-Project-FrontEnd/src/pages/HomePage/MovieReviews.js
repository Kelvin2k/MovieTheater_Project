import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { reviewServ } from "../../services/reviewServ";
import "./MovieReview.css";

const MovieReviews = () => {
  const [listReviews, setListReviews] = useState([]);
  const [listHotMovie, setListHotMovie] = useState([]);
  const [showSlides, setShowSlides] = useState(0);

  useEffect(() => {
    const updateSlides = () => {
      const w = window.innerWidth;
      if (w < 768) setShowSlides(1);
      else if (w < 1280) setShowSlides(2);
      else setShowSlides(3);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: showSlides || 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
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

  useEffect(() => {
    (async () => {
      try {
        const popularMovie = await reviewServ.fetchPopularData();
        const listHotMovie = popularMovie.results.slice(4, 6);
        setListHotMovie(listHotMovie);

        const listFilmReview = [];
        for (const movie of listHotMovie) {
          const reviews = await reviewServ.fetchUserReviewBasedOnFilmId(
            movie.id,
          );
          listFilmReview.push({
            ...reviews,
            poster_path: movie.poster_path,
            title: movie.title,
          });
        }

        setListReviews(listFilmReview);
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="my-10 space-y-8 overflow-x-hidden" id="new_release">
      <h2 className="text-3xl md:text-5xl text-center font-bold uppercase text-red-500">
        New Release
      </h2>
      {listReviews?.map((item, index) => {
        const newListHotMovie = listHotMovie.filter(
          (movie) => movie.id === item.id,
        );

        return (
          <div key={index} className="mb-10 ">
            <div className="mb-4 ">
              <div className="py-5 md:py-10! grid grid-cols-1 lg:grid-cols-2 gap-10">
                <img
                  src={`https://image.tmdb.org/t/p/original${newListHotMovie[0].backdrop_path}`}
                  alt={item.title || "Movie Poster"}
                  className="w-full h-full object-cover rounded-lg scale-90"
                />
                <div className="space-y-5 flex flex-col justify-center items-center lg:block">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {newListHotMovie[0].original_title}
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg px-10 lg:p-0">
                    {newListHotMovie[0].overview}
                  </p>
                  <p className="text-red-500 font-bold">
                    Release Day:{" "}
                    <span className="text-lime-400">
                      {newListHotMovie[0].release_date}
                    </span>
                  </p>
                  <div className="h-30 w-30 rounded-full border-8 bg-lime-500 text-white flex items-center justify-center text-2xl font-bold ">
                    {newListHotMovie[0].vote_average}
                  </div>
                </div>
              </div>
            </div>
            {listReviews ? (
              <div>
                <Slider {...settings}>
                  {item.results?.map((review, reviewIndex) => {
                    let imgURL = "";
                    if (review.author_details.avatar_path) {
                      imgURL = `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`;
                    } else {
                      imgURL = "https://picsum.photos/185";
                    }
                    return (
                      <div key={reviewIndex} className="px-2">
                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                          <div className="grid lg:grid-cols-2 py-3 gap-3 p-4">
                            <img
                              src={imgURL}
                              alt=""
                              className="rounded-lg w-full h-50 object-cover"
                            />
                            <div className="content space-y-1 flex flex-col justify-start md:block">
                              <div>
                                <div className="">
                                  <h2 className="font-bold text-base text-white">
                                    User Author:
                                  </h2>
                                  <p className="text-gray-400 text-xs">
                                    {review.author || "anonymous"}
                                  </p>
                                </div>

                                <h2 className="font-bold text-base text-white">
                                  User Name:
                                </h2>
                                <p className="text-gray-500 text-xs ">
                                  {review.author_details.name || "anonymous"}
                                </p>
                                <div className="flex space-x-4">
                                  <p className="self-center font-bold text-white">
                                    Rating:
                                  </p>
                                  <p className="rounded-full bg-amber-400 h-10 w-10 flex items-center justify-center text-white">
                                    {review.author_details.rating || ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-0 px-3 pb-6 sm:p-4">
                            <p className="line-clamp-6 text-white">
                              {review.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : null}
            {/* <div>
              <Slider {...innerSettings}>
                {item.results?.map((review, reviewIndex) => {
                  let imgURL = "";
                  if (review.author_details.avatar_path) {
                    imgURL = `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`;
                  } else {
                    imgURL = "https://picsum.photos/185";
                  }
                  return (
                    <div key={reviewIndex} className="px-2">
                      <Card
                        size="default"
                        title={
                          <div className="grid lg:grid-cols-2 py-3 gap-3">
                            <img
                              src={imgURL}
                              alt=""
                              className="rounded-lg w-full h-50 object-cover"
                            />
                            <div className="content space-y-1">
                              <h2 className="font-bold text-base text-white">
                                User Author:
                              </h2>
                              <p className="text-gray-400 text-xs">
                                {review.author || "anonymous"}
                              </p>
                              <h2 className="font-bold text-base text-white">
                                User Name:
                              </h2>
                              <p className="text-gray-500 text-xs ">
                                {review.author_details.name || "anonymous"}
                              </p>
                              <div className="flex space-x-4">
                                <p className="self-center font-bold text-white">
                                  Rating:
                                </p>
                                <p className="rounded-full bg-amber-400 h-10 w-10 flex items-center justify-center text-white">
                                  {review.author_details.rating || ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        }
                        style={{ width: 300 }}
                      >
                        <p className="line-clamp-6 text-white">
                          {review.content}
                        </p>
                      </Card>
                    </div>
                  );
                })}
              </Slider>
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default MovieReviews;
