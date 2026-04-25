import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { filmServManagement } from "../../services/filmServManagement";
import dayjs from "dayjs";
import { DatePicker, notification } from "antd";
import { useFormik } from "formik";
import { cinemaSchedule } from "../../services/cinemaSchedule";
import { validateCreateShowTime } from "../../utils/validation";

const AddShowTime = () => {
  const { movieId } = useParams();
  const [movieDetail, setMovieDetail] = useState({});
  const [clusterList, setClusterList] = useState([]);
  const [cinemaList, setCinemaList] = useState([]);

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };
  useEffect(() => {
    filmServManagement
      .getMovieInfo(movieId)
      .then((result) => {
        setMovieDetail(result.data);
      })
      .catch((err) => {
        const errMsg = err?.response?.data || "Error happens";
        openNotificationWithIcon("error", "Scheduling Failed", errMsg);
      });
  }, [movieId]);

  const formik = useFormik({
    initialValues: {
      cinema_chain_id: "",
      cinema_id: "",
      screening_time: "",
      ticket_price: "",
      movie_id: "",
      cinema_complex_id: "",
    },
    validationSchema: validateCreateShowTime,
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      cinemaSchedule
        .createShowTime(values)
        .then((result) => {
          openNotificationWithIcon(
            "success",
            "Success!",
            "Showtime has been scheduled successfully!",
          );
          resetForm();
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        })
        .catch((err) => {
          const errMsg =
            err?.response?.data ||
            "Unable to schedule showtime. Please check your inputs and try again.";
          openNotificationWithIcon("error", "Scheduling Failed", errMsg);
        });
    },
  });
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
  } = formik;

  useEffect(() => {
    if (values.cinema_chain_id) {
      cinemaSchedule
        .getClusterInfoBySystem(values.cinema_chain_id)
        .then((result) => {
          setClusterList(result.data);
        })
        .catch((err) => {
          const errMsg =
            err?.response?.data ||
            "Unable to schedule showtime. Please check your inputs and try again.";
          openNotificationWithIcon("error", "Scheduling Failed", errMsg);
        });
    } else {
      setClusterList([]);
    }
  }, [values.cinema_chain_id]);

  useEffect(() => {
    if (values.cinema_complex_id) {
      cinemaSchedule
        .getCinemaListByCinemaComplexId(values.cinema_complex_id)
        .then((result) => {
          setCinemaList(result.data);
        })
        .catch((err) => {
          const errMsg =
            err?.response?.data ||
            "Unable to schedule showtime. Please check your inputs and try again.";
          openNotificationWithIcon("error", "Scheduling Failed", errMsg);
        });
    } else {
      setCinemaList([]);
    }
  }, [values.cinema_complex_id]);

  values.movie_id = movieId;

  return (
    <div className="flex justify-center items-center flex-col">
      {contextHolder}
      <div className="movie_detail bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs mb-10">
        <h3 className="text-lg font-bold text-center">
          {movieDetail.movie_name}
        </h3>

        <img
          className="rounded-base w-full h-auto mt-2"
          src={movieDetail.image}
          alt="Movie Poster"
        />

        <p className="mb-6 text-gray-700 text-base font-semibold mt-3">
          {movieDetail.description}
        </p>
      </div>
      <h2 className="text-3xl font-bold uppercase mb-10">Schedule Showtime</h2>

      <form className="w-full mb-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 mb-5">
          <label
            htmlFor="cinema_chain_id"
            className="block mb-2.5 text-sm font-medium text-heading col-span-1 self-center"
          >
            Cinema System
          </label>
          <select
            id="cinema_chain_id"
            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body col-span-2 mb-1"
            name="cinema_chain_id"
            value={values.cinema_chain_id}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Cinema System</option>
            <option value="1">Hoyts</option>
            <option value="2">Village Cinemas</option>
            <option value="3">Palace Cinemas</option>
            <option value="4">Reading Cinemas</option>
          </select>
          {touched.cinema_chain_id && errors.cinema_chain_id ? (
            <p className="text-red-500 italic col-start-2 col-span-2">
              {errors.cinema_chain_id}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3">
          <label
            htmlFor="cinema_complex_id"
            className="block mb-2.5 text-sm font-medium text-heading col-span-1 self-center"
          >
            Cinema Cluster
          </label>
          <select
            id="cinema_complex_id"
            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body col-span-2 mb-5"
            name="cinema_complex_id"
            value={values.cinema_complex_id}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Cinema Cluster</option>
            {clusterList.map((item, index) => {
              return (
                <option key={index} value={item.cinema_complex_id}>
                  {item.cinema_complex_name}
                </option>
              );
            })}
          </select>
          {touched.cinema_complex_id && errors.cinema_complex_id ? (
            <p className="text-red-500 italic col-start-2 col-span-2">
              {errors.cinema_complex_id}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3">
          <label
            htmlFor="cinema_id"
            className="block mb-2.5 text-sm font-medium text-heading col-span-1 self-center"
          >
            Cinema
          </label>
          <select
            id="cinema_id"
            className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body col-span-2 mb-5"
            name="cinema_id"
            value={values.cinema_id}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Cinema </option>
            {cinemaList.map((item, index) => {
              return (
                <option key={index} value={item.cinema_id}>
                  {item.cinema_name}
                </option>
              );
            })}
          </select>
          {touched.cinema_id && errors.cinema_id ? (
            <p className="text-red-500 italic col-start-2 col-span-2">
              {errors.cinema_id}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3">
          <label
            htmlFor="screening_time"
            className="block text-sm font-medium text-heading self-center"
          >
            Show Date and Time
          </label>
          <DatePicker
            className="w-full col-span-2 pb-5!"
            showTime={{
              format: "HH:mm",
              defaultValue: dayjs("00:00", "HH:mm"),
            }}
            onChange={(date, dateString) => {
              setFieldValue("screening_time", dateString);
            }}
            onBlur={() => {
              setFieldTouched("screening_time", true);
            }}
            value={
              values.screening_time
                ? dayjs(values.screening_time, "DD/MM/YYYY HH:mm:ss")
                : null
            }
            format={"DD/MM/YYYY HH:mm:ss"}
          />
          {touched.screening_time && errors.screening_time ? (
            <p className="text-red-500 italic col-start-2 col-span-2">
              {errors.screening_time}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3 mt-5">
          <label
            htmlFor="ticket_price"
            className="block text-sm font-medium text-heading col-span-1 self-center"
          >
            Ticket Price
          </label>
          <input
            type="number"
            id="ticket_price"
            name="ticket_price"
            value={values.ticket_price}
            onBlur={handleBlur}
            onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body col-span-2"
            placeholder="Enter Ticket Price"
          />
          {touched.ticket_price && errors.ticket_price ? (
            <p className="text-red-500 italic col-start-2 col-span-2">
              {errors.ticket_price}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="flex w-fit items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0 bg-red-500 hover:bg-red-700 cursor-pointer duration-300 mx-auto mt-5!"
          onClick={() => {
            // showModal(true);
          }}
        >
          Create Showtime
        </button>
      </form>
    </div>
  );
};

export default AddShowTime;
