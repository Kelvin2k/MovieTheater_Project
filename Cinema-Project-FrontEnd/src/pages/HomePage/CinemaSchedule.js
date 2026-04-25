import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { cinemaSchedule } from "../../services/cinemaSchedule";
import CinemaShowTime from "./CinemaShowTime";

const CinemaSchedule = () => {
  const [cinema, setCinema] = useState([]);
  const [styleTab, setStyleTab] = useState("left");

  useEffect(() => {
    cinemaSchedule
      .getAllCinema()
      .then((result) => {
        setCinema(result.data);
      })
      .catch((err) => {});
  }, []);

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
    <div className="my-20 px-3 overflow-x-hidden" id="now_showing">
      <div className="block container lg:mx-auto">
        <Tabs
          defaultActiveKey="1"
          tabPlacement={styleTab}
          items={cinema?.map((item, index) => {
            return {
              label: (
                <img
                  src={item.logo}
                  className="w-24"
                  alt={item.cinema_chain_name || "Cinema logo"}
                />
              ),
              key: item.cinema_chain_id,
              children: <CinemaShowTime cinemaCode={item.cinema_chain_id} />,
            };
          })}
        />
      </div>
    </div>
  );
};

export default CinemaSchedule;
