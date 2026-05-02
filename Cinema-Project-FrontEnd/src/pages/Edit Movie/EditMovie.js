import { DatePicker, notification, Rate, Switch } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { filmServManagement } from "../../services/filmServManagement";
import { useNavigate, useParams } from "react-router-dom";

const EditMovie = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { movieId } = params;

  const formik = useFormik({
    initialValues: {
      movie_id: "",
      movie_name: "",
      trailer: "",
      description: "",
      opening_date: "",
      now_showing: false,
      coming_soon: false,
      hot: false,
      rate: 0,
      image: "",
    },
    onSubmit: (values, { resetForm }) => {
      let formattedDate = values.opening_date;
      if (values.opening_date) {
        formattedDate = dayjs(values.opening_date, "DD-MM-YYYY").format(
          "DD-MM-YYYY HH:mm:ss",
        );
      }
      const formData = new FormData();
      for (let key in values) {
        if (key === "image") {
          formData.append("image", values[key]);
        } else if (key === "opening_date") {
          formData.append(key, formattedDate);
        } else {
          formData.append(key, values[key]);
        }
      }

      filmServManagement
        .updateMovieInfo(formData)
        .then((result) => {
          openNotificationWithIcon(
            "success",
            "Update Movie Successful",
            "Movie has been updated successfully.",
          );
          resetForm();
          setImage("");
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        })
        .catch((err) => {
          const errMsg =
            err.response?.data?.message ||
            "Failed to update movie. Please try again.";
          openNotificationWithIcon("error", "Update Movie Failed", errMsg);
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
    setFieldValue,
    setFieldTouched,
  } = formik;

  const [image, setImage] = useState("");

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
        const newValue = result.data;
        formik.setValues({
          movie_id: newValue.movie_id ?? "",
          movie_name: newValue.movie_name ?? "",
          trailer: newValue.trailer ?? "",
          description: newValue.description ?? "",
          opening_date: newValue.opening_date
            ? dayjs(newValue.opening_date).format("DD-MM-YYYY")
            : "",
          now_showing: newValue.now_showing ?? false,
          coming_soon: newValue.coming_soon ?? false,
          hot: newValue.hot ?? false,
          rate: newValue.rate ?? 0,
          image: newValue.image,
        });
        setImage(`${process.env.REACT_APP_API_URL}${newValue.image}`);
      })
      .catch((err) => {
        navigate("/*");
      });
  }, [movieId, navigate, setValues]);

  return (
    <div>
      {contextHolder}
      <h2 className="font-bold text-3xl capitalize mb-5">Edit Film</h2>
      <form action="" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="movie_name"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Movie Name
          </label>
          <input
            type="text"
            id="movie_name"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="John"
            name="movie_name"
            value={values.movie_name}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.movie_name && errors.movie_name ? (
            <p className="text-red-500 italic">{errors.movie_name}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="trailer"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Trailer
          </label>
          <input
            type="text"
            id="trailer"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="John"
            name="trailer"
            value={values.trailer}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.trailer && errors.trailer ? (
            <p className="text-red-500 italic">{errors.trailer}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="John"
            name="description"
            value={values.description}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.description && errors.description ? (
            <p className="text-red-500 italic">{errors.description}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="opening_date"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Release Date
          </label>
          <DatePicker
            onChange={(date, dateString) => {
              setFieldValue("opening_date", dateString);
            }}
            onBlur={() => {
              setFieldTouched("opening_date", true);
            }}
            value={
              values.opening_date
                ? dayjs(values.opening_date, "DD-MM-YYYY")
                : null
            }
            format={"DD-MM-YYYY"}
          />
          {touched.opening_date && errors.opening_date ? (
            <p className="text-red-500 italic">{errors.opening_date}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="now_showing"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Is Releasing
          </label>
          <Switch
            onChange={(checked, boolean) => {
              setFieldValue("now_showing", checked);
            }}
            value={values.now_showing}
          />
          {touched.now_showing && errors.now_showing ? (
            <p className="text-red-500 italic">{errors.now_showing}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="coming_soon"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Will Release
          </label>
          <Switch
            defaultChecked
            onChange={(checked, boolean) => {
              setFieldValue("coming_soon", checked);
            }}
            value={values.coming_soon}
          />
          {touched.coming_soon && errors.coming_soon ? (
            <p className="text-red-500 italic">{errors.coming_soon}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="hot"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Hot
          </label>
          <Switch
            defaultChecked
            onChange={(checked, boolean) => {
              setFieldValue("hot", checked);
            }}
            value={values.hot}
          />
          {touched.hot && errors.hot ? (
            <p className="text-red-500 italic">{errors.hot}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="rate"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Star
          </label>
          <Rate
            allowHalf
            value={values.rate}
            onChange={(value) => {
              setFieldValue("rate", value);
            }}
          />
          {touched.rate && errors.rate ? (
            <p className="text-red-500 italic">{errors.rate}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="image"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Image
          </label>
          <img src={image} alt="" className="my-5 w-1/2" />
          <input
            type="file"
            className=""
            name="image"
            onBlur={handleBlur}
            accept="image/*"
            onChange={(event) => {
              const img = event.target.files[0];
              if (img) {
                const urlImg = URL.createObjectURL(img);
                setImage(urlImg);
              }
              setFieldValue("image", img);
            }}
          />
          {touched.image && errors.image ? (
            <p className="text-red-500 italic">{errors.image}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="text-white bg-black py-2 px-5 rounded-md mt-5"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditMovie;
