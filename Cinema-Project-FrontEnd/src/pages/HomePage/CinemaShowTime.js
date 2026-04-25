import React, { useEffect, useState } from "react";
import { filmServManagement } from "../../services/filmServManagement";
import { Tabs } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "./CinemaShowTime.css";
import TrailLoading from "../../components/Loading/TrailLoading";

const CinemaShowTime = ({ cinemaCode }) => {
  const [cinemaDetail, setCinemaDetail] = useState([]);
  const [styleTab, setStyleTab] = useState("left");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    filmServManagement
      .getCinemaShowTime(cinemaCode)
      .then((result) => {
        setCinemaDetail(result.data.lstCinemaComplex);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [cinemaCode]);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setStyleTab("top");
      } else {
        setStyleTab("left");
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <div className="">
      {loading ? (
        <TrailLoading />
      ) : (
        <Tabs
          defaultActiveKey="1"
          tabPlacement={styleTab}
          items={cinemaDetail?.map((theater, index) => {
            return {
              label: (
                <div className="text-left" key={theater.cinema_complex_id}>
                  <h2 className="uppercase text-green-500 text-xs md:text-sm lg:text-base w-full">
                    {theater.cinema_complex_name}
                  </h2>
                  <p className="text-gray-300 text-xs max-w-130 truncate lg:text-sm w-full ">
                    {theater.address}
                  </p>
                  <p className="text-red-500 w-fit overflow-hidden">
                    [Details]
                  </p>
                </div>
              ),
              key: index.toString(),
              children: (
                <div className="space-y-5">
                  {theater.moviesInComplex?.map((film, index) => {
                    return (
                      <div className="grid grid-cols-3! gap-x-5" key={index}>
                        <img
                          src={film.image}
                          alt=""
                          className="h-full w-full object-cover col-span-1 mb-4"
                        />
                        <div className="header col-span-2 mt-1 w-full ">
                          <p className="font-bold mb-3 text-white">
                            <span className="rounded-sm bg-red-500 px-2 py-2 mb-2 w-fit text-white mr-1">
                              C18
                            </span>
                            {film.tenPhim}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-2! md:grid-cols-2! lg:grid-cols-2! xl:grid-cols-3! w-full md:gap-3">
                            {film.lstShowTimesOnMovie
                              ?.slice(0, 5)
                              .map((filmShowTime, index) => {
                                const formattedDate = dayjs(
                                  filmShowTime.screening_time,
                                ).format("DD/MM/YYYY");
                                const formattedTime = dayjs(
                                  filmShowTime.screening_time,
                                ).format("HH:mm");
                                return (
                                  <div
                                    className="mt-2 col-span-1 w-full"
                                    key={index}
                                  >
                                    <Link
                                      to={`/detail_movie/${film.movie_id}`}
                                      className=""
                                    >
                                      <p className="rounded-sm! bg-gray-100! text-green-500! w-fit! px-2! py-1! cursor-pointer text-[10px] sm:text-[13px] lg:text-base hover:bg-gray-500! hover:text-white! duration-200 group">
                                        {formattedDate} ~
                                        <span className="text-red-500 ml-1 group-hover:text-green-400!">
                                          {formattedTime}
                                        </span>
                                      </p>
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            };
          })}
        />
      )}
    </div>
  );
};

export default CinemaShowTime;
