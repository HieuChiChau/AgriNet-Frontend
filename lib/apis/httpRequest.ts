import axios from "axios";
import { getAuthorizationClient } from "./cache-client";

export const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpRequest.interceptors.request.use(
  function (config) {
    const token = getAuthorizationClient();
    config.headers["Authorization"] = "Bearer " + token;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
