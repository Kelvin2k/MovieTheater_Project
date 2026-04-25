import axios from "axios";
import { getLocalStorage } from "../utils/local";

const dataUser = getLocalStorage("userInfo");
export const https = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 15000,
  headers: {
    Token: dataUser ? dataUser.token : null,
    Authorization: "Bearer " + process.env.REACT_APP_TOKEN_BACKEND,
  },
});

// request interceptor
axios.interceptors.request.use(
  function (config) {
    if (dataUser) {
      config.headers.Authorization = getLocalStorage("userInfo").accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

https.interceptors.response.use(function (response) {
  return response.data;
});

export const adminHttps = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 15000,
  headers: {
    Authorization: "Bearer " + process.env.REACT_APP_AUTHORIZATION_TOKEN,
    Token: process.env.REACT_APP_TOKEN_BACKEND,
  },
});

adminHttps.interceptors.response.use(function (response) {
  return response.data;
});
