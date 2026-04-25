import { useFormik } from "formik";
import React, { useState } from "react";
import { addUserValidation } from "../../utils/validation";
import { userServ } from "../../services/userServ";
import { notification } from "antd";

const ManagerAddUser = ({ setOpenAdd, setUserList }) => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
      phone_number: "",
      user_type: "",
    },
    validationSchema: addUserValidation,
    onSubmit: (values, { resetForm }) => {
      userServ
        .addUser(values)
        .then((result) => {
          setOpenAdd(false);
          openNotificationWithIcon(
            "success",
            "Add User Successful",
            "User has been added successfully.",
          );
          userServ
            .fetchUserDataList()
            .then((result) => {
              setUserList(result.data.content);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          const errMsg =
            err?.response?.data?.message ||
            "Failed to add user. Please try again.";
          openNotificationWithIcon("error", "Add User Failed", errMsg);
        });
    },
  });

  const { touched, handleBlur, handleChange, handleSubmit, values, errors } =
    formik;
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title = "", description = "") => {
    api[type]({
      title: title,
      description: description,
    });
  };
  return (
    <div className="min-h-200 container mx-auto flex justify-center items-center">
      {contextHolder}
      <div className="w-full">
        <h1 className="text-center font-bold uppercase text-3xl mb-10">
          New User Form
        </h1>

        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
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
              placeholder="Full name"
              name="name"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.name && errors.name ? (
              <span className="italic text-red-500">{errors.name}</span>
            ) : null}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="••••••••"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-1/4 right-3 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <i
                  className={
                    showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                  }
                ></i>
              </button>
              {touched.password && errors.password ? (
                <span className="italic text-red-500">{errors.password}</span>
              ) : null}
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              User Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="email@example.com"
              name="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.email && errors.email ? (
              <span className="italic text-red-500">{errors.email}</span>
            ) : null}
          </div>
          <div className="mb-5">
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
              placeholder="0977123456"
              name="phone_number"
              value={values.phone_number}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.phone_number && errors.phone_number ? (
              <span className="italic text-red-500">{errors.phone_number}</span>
            ) : null}
          </div>
          <div className="mb-5">
            <label
              htmlFor="user_type"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              User Type
            </label>
            <select
              id="user_type"
              className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
              name="user_type"
              value={values.user_type}
              onBlur={handleBlur}
              onChange={handleChange}
            >
              <option value="">Select User Type</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            {touched.user_type && errors.user_type ? (
              <span className="italic text-red-500">{errors.user_type}</span>
            ) : null}
          </div>
          <button
            type="submit"
            className="cursor-pointer text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerAddUser;
