import dayjs from "dayjs";
import React from "react";

const TicketHistoryTab = ({ userData }) => {
  return (
    <div className="grid grid-cols-2 gap-5">
      {userData.BookingInfo?.map((item, index) => {
        const cinemaSystemName = item.seatsList[0].cinema_chain_name;
        const cinemaComplexName = item.seatsList[0].cinema_complex_name;
        return (
          <div className="grid grid-cols-2 gap-5" key={index}>
            <img
              src={`${process.env.REACT_APP_API_URL}${item.image}`}
              alt=""
              className="w-full h-60 object-cover"
            />
            <div className="content_left space-y-1 py-2">
              <div className="content_up space-y-1">
                <h2 className="text-base font-bold">{cinemaSystemName}</h2>
                <p className="text-gray-400">{cinemaComplexName}</p>
              </div>
              <div className="content_down space-y-1 ">
                <p className="font-bold">
                  Booking date:
                  <br />
                  <span className="text-red-500">
                    {dayjs(item.bookingDate).format("DD/MM/YYYY")} ~{" "}
                    {dayjs(item.bookingDate).format("HH:mm")}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {item.seatsList?.map((seat, index) => {
                    return (
                      <p className="text-green-500 line-clamp-3" key={index}>
                        Screen: {seat.cinema_chain_name}{" "}
                        <span> ~ Seat: {seat.seat_name}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketHistoryTab;
