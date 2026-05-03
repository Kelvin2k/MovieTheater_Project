import { Carousel } from "antd";
import React, { useEffect, useState } from "react";
import { movieDBServ } from "../../services/movieDBServ";

const Banner = () => {
  const [listBanner, setListBanner] = useState([]);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", transform: "scale(2)" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", transform: "scale(2)" }}
        onClick={onClick}
      />
    );
  }

  const setting = {
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    arrows: true,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await movieDBServ.fetchMovieBanner();

        setListBanner(data.results);
      } catch (error) {}
    };
    fetchBanners();
  }, []);

  return (
    <Carousel {...setting}>
      {listBanner?.map((item, index) => {
        return (
          <div key={item.banner_id} className="w-screen">
            <img
              src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
              alt=""
              className="w-full overflow-hidden h-60 sm:h-80! md:h-175! object-cover"
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default Banner;
