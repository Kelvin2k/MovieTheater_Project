import React from "react";
import loginAnimation from "./../../assets/animation/loginAnimation.json";
import Lottie from "lottie-react";
import { useFormik } from "formik";
import { userValidation } from "../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { getLocalStorage, saveLocalStore } from "../../utils/local";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/Slice/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    style: { height: 400, width: "100%" },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { resetForm }) => {
      dispatch(loginUser(values))
        .unwrap()
        .then((result) => {
          openNotificationWithIcon("success", "Login Successful!", "");
          saveLocalStore(result, "userInfo");
          const userInformation = getLocalStorage("userInfo");
          setTimeout(() => {
            if (userInformation.user_type === "QuanTri") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 2000);
        })
        .catch((err) => {
          const errMsg =
            err.response?.data?.message ||
            "Failed to login user! Please try again.";
          openNotificationWithIcon("error", "Log In Failed!", errMsg);
        });

      resetForm();
    },
    validationSchema: userValidation,
  });

  const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
    formik;

  return (
    <>
      {contextHolder}
      <div className="container mx-auto relative w-screen md:h-[70vh] h-screen flex justify-center items-center">
        <div className="grid md:grid-cols-[2fr_3fr] grid-cols-1">
          <div className="col_left">
            <Lottie {...defaultOptions} />
          </div>
          <div className="col_right md:p-5 px-5">
            <form action="" onSubmit={handleSubmit}>
              <h2 className="text-3xl font-bold capitalize">Login Movie</h2>
              <div className="flex flex-col space-y-5 mt-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    User Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="John"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email ? (
                    <p className="text-red-500 italic">{errors.email}</p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="John"
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password ? (
                    <p className="text-red-500 italic">{errors.password}</p>
                  ) : null}
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md bg-green-500 text-white hover:bg-green-700 duration-500 cursor-pointer py-2 px-5 mt-3"
              >
                Log in
              </button>
              <button
                type="button"
                className="ml-3 rounded-md bg-orange-500 text-white hover:bg-orange-700 duration-500 cursor-pointer py-2 px-5 mt-3"
              >
                <Link to={"/sign_up"}>Sign Up</Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
