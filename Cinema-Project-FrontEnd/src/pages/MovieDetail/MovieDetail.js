import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { cinemaSchedule } from "../../services/cinemaSchedule";
import { Tabs } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { endedLoading, startedLoading } from "../../redux/Slice/loadingSlice";

const MovieDetail = () => {
  const params = useParams();
  const [listCinema, setListCinema] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(startedLoading());
    cinemaSchedule
      .getMovieShowTime(params.movieId)
      .then((result) => {
        console.log(result.data.CinemaChain);

        setListCinema(result.data.CinemaChain);
        setMovieInfo(result.data);
        dispatch(endedLoading());
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [params.movieId, dispatch]);

  return (
    <div className=" mx-auto pb-10" style={{ backgroundColor: "#0B2029" }}>
      <div className="text-center py-5">
        <div className="h-30 w-30 rounded-full border border-[15px] border-lime-500 flex items-center justify-center text-yellow-500 text-5xl font-bold mx-auto">
          {movieInfo.rate}
        </div>
        <div className="flex items-center space-x-1 justify-center mt-3">
          {Array.from({ length: Math.floor(movieInfo.rate) }, (_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-fg-yellow"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="content_up grid grid-cols-1 p-5 md:p-0 md:grid-cols-2 text-white my-5 gap-x-10 container mx-auto">
        <img
          src={movieInfo.image}
          alt=""
          className="w-full min-h-[600px] object-cover rounded-xl"
        />
        <div className="content_left space-y-3 h-full flex flex-col mt-5 md:mt-0">
          <p className="">
            Release Day:
            <span className="text-red-500 ml-3">
              {dayjs(movieInfo.opening_date).format("DD/MM/YYYY")}
            </span>
          </p>

          <h2 className="font-bold text-3xl text-green-500">
            {movieInfo.movie_name}
          </h2>
          <p className="description">{movieInfo.description}</p>

          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${
              movieInfo.trailer?.split("v=")[1]?.split("&")[0]
            }`}
            title={movieInfo.movie_name}
            allow="autoplay"
          ></iframe>
          <button
            className="bg-red-500 w-fit text-white text-sm px-3 py-2 md:text-2xl md:px-6 md:py-4 rounded mt-5 cursor-pointer hover:bg-red-700 duration-300"
            onClick={() => {
              document
                .querySelector(".content_down")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="content_down bg-white container mx-auto rounded-xl">
        <Tabs
          defaultActiveKey="1"
          tabPlacement={"start"}
          style={{ padding: "20px" }}
          items={listCinema?.map((cinema, index) => {
            return {
              label: (
                <img
                  src={cinema.logo}
                  alt=""
                  className="w-10 sm:w-20! md:w-26!"
                />
              ),
              key: cinema.cinemaChainName,
              children: (
                <div className="space-y-5">
                  {cinema.complexesCinema?.map((showTime, index) => {
                    return (
                      <div key={showTime.cinemaComplexId}>
                        <h3 className="text-lime-500 font-bold text-base md:text-xl mb-5">
                          {showTime.cinemaComplexName}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3! md:grid-cols-4! gap-5">
                          {showTime.showTimes?.map((showSchedule, index) => {
                            return (
                              <NavLink
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(
                                    `/booking_ticket/${showSchedule.showtimesId}`,
                                  );
                                }}
                              >
                                <p className="text-green-600 bg-gray-100 w-fit rounded-md px-3 py-2 hover:bg-gray-400 hover:text-white duration-300 group text-2xs">
                                  {dayjs(showSchedule.screeningTime).format(
                                    "DD/MM/YYYY",
                                  )}{" "}
                                  ~
                                  <span className="text-red-500 ml-1 group-hover:text-white">
                                    {dayjs(showSchedule.screeningTime).format(
                                      "HH:mm",
                                    )}
                                  </span>
                                </p>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default MovieDetail;
