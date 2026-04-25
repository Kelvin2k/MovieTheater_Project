import * as yup from "yup";

export const userValidation = yup.object({
  email: yup.string().required("Please enter the user email"),
  password: yup.string().required("Please input password"),
});

export const signUpValidation = yup.object({
  email: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ),
  password: yup.string().required("Please do not leave this field empty"),
  inputPasswordAgain: yup
    .string()
    .required("Please do not leave this field empty")
    .oneOf([yup.ref("password"), null], "Password must match"),
  name: yup.string().required("Please do not leave this field empty"),

  phone_number: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(/^(04|02|03|07|08)\d{8}$/, "Invalid Australian phone number"),
});

export const addUserValidation = yup.object({
  name: yup.string().required("Please do not leave this field empty"),
  email: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ),
  phone_number: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(/^(04|02|03|07|08)\d{8}$/, "Invalid Australian phone number"),
  password: yup.string().required("Please do not leave this field empty"),
  user_type: yup.string().required("Please do not leave this field empty"),
});

export const updateUserValidation_Admin = yup.object({
  account_id: yup
    .number()
    .typeError("Please do not leave this field empty")
    .required("Please do not leave this field empty"),
  name: yup.string().required("Please do not leave this field empty"),
  email: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ),
  phone_number: yup
    .string()
    .required("Please do not leave this field empty")
    .matches(/^(04|02|03|07|08)\d{8}$/, "Invalid Australian phone number"),
  password: yup.string().required("Please do not leave this field empty"),
  user_type: yup.string().required("Please do not leave this field empty"),
});

export const validateCreateShowTime = yup.object({
  cinema_chain_id: yup
    .string()
    .required("Please do not leave this field empty"),
  cinema_id: yup.string().required("Please do not leave this field empty"),
  screening_time: yup.string().required("Please do not leave this field empty"),
  ticket_price: yup.string().required("Please do not leave this field empty"),
  movie_id: yup.string().required("Please do not leave this field empty"),
  cinema_complex_id: yup
    .string()
    .required("Please do not leave this field empty"),
});
