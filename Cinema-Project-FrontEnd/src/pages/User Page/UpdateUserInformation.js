import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserName } from "../../redux/Slice/userSlice";
import { saveLocalStore } from "../../utils/local";
import { userServ } from "../../services/userServ";
import { notification } from "antd";

const UpdateUserInformation = ({ userData }) => {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      account_id: "",
      password: "",
      email: "",
      phone_number: "",
      name: "",
    },
    onSubmit: (values, { resetForm }) => {
      userServ
        .updateUserInfo_User(values)
        .then((result) => {
          saveLocalStore("userInfo", result);
          dispatch(updateUserName(result.name));
          openNotificationWithIcon(
            "success",
            "Update User Successful",
            "Your information has been updated successfully.",
          );
          resetForm();
        })
        .catch((err) => {
          const errMsg = err || "Failed to update user. Please try again.";
          openNotificationWithIcon("error", "Update User Failed", errMsg);
        });
    },
  });

  const { values, setValues, handleBlur, handleChange, handleSubmit } = formik;

  useEffect(() => {
    if (userData) {
      const initData = { ...userData, password: "" };
      setValues(initData);
    }
  }, [userData, setValues]);

  return (
    <div className="bg-neutral-primary-soft shadow-xs rounded-base border border-default p-6 grid grid-cols-2">
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-base font-medium">{values.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-base font-medium">{values.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="text-base font-medium">{values.phone_number}</p>
        </div>
        <div className="space-y-1 ">
          <p className="text-sm text-gray-500">Account Id</p>
          <p className="text-base font-medium ">{values.account_id}</p>
        </div>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Your email
            </label>
            <input
              type="text"
              id="email"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              disabled
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body pr-14"
                placeholder="1234"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 font-medium cursor-pointer text-blue-600 hover:text-blue-800 select-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="phone_number"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              name="phone_number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone_number}
            />
          </div>
        </div>

        <button
          type="submit"
          className="text-white cursor-pointer bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUserInformation;
