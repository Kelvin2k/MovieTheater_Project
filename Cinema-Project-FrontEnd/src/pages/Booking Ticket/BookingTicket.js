import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cinemaSchedule } from "../../services/cinemaSchedule";
import { Modal, notification } from "antd";
import { useDispatch } from "react-redux";
import { endedLoading, startedLoading } from "../../redux/Slice/loadingSlice";

const BookingTicket = () => {
  const params = useParams();
  const { showTimeId } = params;
  const [seatLayout, setSeatLayout] = useState([]);
  const [movieInfo, setmovieInfo] = useState({});
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const payload = {
      showtimes_id: Number(showTimeId),
      ticket_list: selectedSeat.map(({ seat_id, seat_price }) => ({
        seat_id,
        ticket_price: Number(seat_price),
      })),
    };

    cinemaSchedule
      .bookTicket(payload)
      .then((result) => {
        openNotificationWithIcon(
          "success",
          "Booking Successful!",
          "Your Booking has been confirmed! Thank you!",
        );
        cinemaSchedule
          .getShowTimeSeat(showTimeId)
          .then((result) => {
            setSeatLayout(result.data.seatsList);
            setmovieInfo(result.data.movieInfo);
            setSelectedSeat([]);
            setTotal(0);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        const errMsg =
          err?.response?.data || "Failed to book ticket! Please try again.";
        openNotificationWithIcon("error", "Booking failed!", errMsg);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };

  const seatTypeNormal = [
    "w-10 h-10 rounded-sm bg-gray-300 flex items-center justify-center text-black cursor-pointer hover:bg-gray-600 duration-300",
  ];
  const seatTypeVip = [
    "w-10 h-10 rounded-sm bg-orange-400 flex items-center justify-center text-black cursor-pointer hover:bg-gray-500 duration-300",
  ];
  const seatTaken = [
    "w-10 h-10 rounded-sm bg-gray-700 flex items-center justify-center cursor-not-allowed font-bold",
  ];
  const seatSelected = [
    "w-10 h-10 rounded-sm bg-green-700 text-white flex items-center justify-center font-bold cursor-pointer",
  ];

  useEffect(() => {
    dispatch(startedLoading());

    cinemaSchedule
      .getShowTimeSeat(showTimeId)
      .then((result) => {
        dispatch(endedLoading());
        setSeatLayout(result.data.seatsList);
        setmovieInfo(result.data.movieInfo);
        dispatch(endedLoading());
      })
      .catch((err) => {
        dispatch(endedLoading());
        navigate("/*");
      });
  }, [dispatch, navigate, showTimeId]);
  useEffect(() => {
    setTotal(
      selectedSeat.reduce((sum, seat) => sum + (seat.seat_price || 0), 0),
    );
  }, [selectedSeat]);

  return (
    <div className="container mx-auto">
      {contextHolder}

      <div className="content grid grid-cols-1 md:grid-cols-5! sm:gap-x-5 py-10 lg:gap-x-20">
        <div className="seat_booking grid grid-cols-5 lg:grid-cols-8! col-span-full sm:col-span-3 gap-3 p-3 rounded-2xl">
          {seatLayout.map((seat, index) => {
            const isSlected = selectedSeat.some(
              (s) => s.seat_name === seat.seat_name,
            );
            return (
              <div key={index}>
                {seat.userName === null && seat.seat_type === "Standard" ? (
                  <button
                    className={isSlected ? seatSelected : seatTypeNormal}
                    key={index}
                    name={seat.seat_name}
                    value={seat.seat_name}
                    onClick={(e) => {
                      setSelectedSeat((prev) => {
                        const exists = prev.some(
                          (s) => s.seat_name === seat.seat_name,
                        );
                        if (exists)
                          return prev.filter(
                            (s) => s.seat_name !== seat.seat_name,
                          );
                        return [
                          ...prev,
                          {
                            seat_id: seat.seat_id,
                            seat_name: seat.seat_name,
                            seat_price: seat.seat_price,
                          },
                        ];
                      });
                    }}
                  >
                    {index + 1}
                  </button>
                ) : null}
                {seat.userName === null && seat.seat_type === "VIP" ? (
                  <button
                    className={isSlected ? seatSelected : seatTypeVip}
                    key={index}
                    name={seat.seat_name}
                    value={seat.seat_name}
                    onClick={(e) => {
                      setSelectedSeat((prev) => {
                        const exists = prev.some(
                          (s) => s.seat_name === seat.seat_name,
                        );
                        if (exists)
                          return prev.filter(
                            (s) => s.seat_name !== seat.seat_name,
                          );
                        return [
                          ...prev,
                          {
                            seat_id: seat.seat_id,
                            seat_name: seat.seat_name,
                            seat_price: seat.seat_price,
                          },
                        ];
                      });
                    }}
                  >
                    {index + 1}
                  </button>
                ) : null}
                {seat.userName ? (
                  <button
                    className={seatTaken}
                    key={index}
                    name={seat.seat_name}
                    value={seat.seat_name}
                  >
                    X
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4! gap-4 col-span-full md:hidden my-5">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-8 w-8 rounded bg-gray-400 "></div>
            <span className="font-medium text-white text-sm md:text-lg">
              Sold Out
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gray-200"></div>
            <span className="font-medium text-white">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-orange-400"></div>
            <span className="font-medium text-white">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-green-500"></div>
            <span className="font-medium text-white">Selecting</span>
          </div>
        </div>

        <div className="provisional_invoice p-0 lg:pr-10 rounded-lg col-span-full md:mx-0 md:w-full  md:col-span-2!">
          <div>
            <section className="bg-white antialiased dark:bg-gray-900 rounded-lg">
              <Modal
                title="Check Out Confirmation"
                closable={{ "aria-label": "Cusstom Close Button" }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered={true}
              >
                <p>Are you sure you want to complete your order?</p>
              </Modal>
              <form action="" className="mx-auto h-fit">
                <div className="mx-auto md:max-w-3xl p-5 lg:p-5 w-full">
                  <h2 className="lg:text-3xl font-bold text-gray-900 dark:text-white mb-5 text-center uppercase md:text-base text-lg">
                    Provisional Invoice
                  </h2>
                  <img
                    src={`${process.env.REACT_APP_API_URL}${movieInfo.image}`}
                    alt=""
                    className="w-3/4 h-56 lg:h-96 object-cover container mx-auto rounded-lg"
                  />
                  <div className="mt-6 sm:mt-8">
                    <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                      <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Theater System:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base lg:text-lg text-sm font-bold dark:text-white md:w-full text-green-500">
                              {movieInfo.cinema_complex_name}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Theater Addresss:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base lg:text-lg text-sm font-bold dark:text-white md:w-full text-green-500">
                              {movieInfo.address}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Screen Number:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base lg:text-lg text-sm font-bold dark:text-white md:w-full text-green-500">
                              {movieInfo.cinema_name}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Show Time:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base lg:text-lg text-sm font-bold dark:text-white md:w-full text-green-500">
                              {movieInfo.opening_date} ~{" "}
                              <span className="text-red-500">
                                {movieInfo.screening__time}
                              </span>
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Movie Name:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base lg:text-lg text-sm font-bold dark:text-white md:w-full text-green-500">
                              {movieInfo.movie_name}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="whitespace-nowrap py-4 md:w-full">
                              <p className="font-bold md:text-base lg:text-lg text-sm">
                                Seats selected:
                              </p>
                            </td>
                            <td className="p-4 text-right md:text-base text-sm font-bold dark:text-white md:w-full text-green-500 flex justify-end">
                              <div className="grid grid-cols-2 w-fit gap-x-2">
                                {selectedSeat?.map((seat, index) => {
                                  return (
                                    <p className="" key={index}>
                                      Seat {seat.seat_name}
                                    </p>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 space-y-6">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Order summary
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Original price
                            </dt>
                            <dd className="md:text-base text-sm font-medium text-gray-900 dark:text-white">
                              {total}
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                              Savings
                            </dt>
                            <dd className="md:text-base text-sm font-medium text-green-500">
                              0
                            </dd>
                          </dl>
                        </div>
                        <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                          <dt className="md:text-lg text-sm font-bold text-gray-900 dark:text-white">
                            Total
                          </dt>
                          <dd className="md:text-lg text-sm font-bold text-gray-900 dark:text-white">
                            {total} AUD
                          </dd>
                        </dl>
                      </div>
                      <div className="gap-4 flex items-center justify-center mt-4">
                        <button
                          type="button"
                          className="rounded-lg  border border-gray-200 px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 cursor-pointer duration-300 bg-gray-200 w-fit"
                          onClick={() => {
                            navigate(-1);
                          }}
                        >
                          Return
                        </button>
                        <button
                          type="button"
                          className=" flex items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0 bg-red-500 hover:bg-red-700 cursor-pointer duration-300 w-fit"
                          onClick={() => {
                            showModal(true);
                          }}
                        >
                          Click to buy!
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
        <div className="md:flex! mt-2 pl-3 items-center gap-4 col-span-full hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-8 w-8 rounded bg-gray-400 "></div>
            <span className="font-medium text-white">Sold Out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gray-200"></div>
            <span className="font-medium text-white">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-orange-400"></div>
            <span className="font-medium text-white">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-green-500"></div>
            <span className="font-medium text-white">Selecting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;
