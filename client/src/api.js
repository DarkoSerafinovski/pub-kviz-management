import axios from "axios";
import { getSession } from "./auth/sessionStore";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message = error?.response?.data?.message || "Greška na serveru";

    return Promise.reject({
      message,
      status: error?.response?.status,
    });
  },
);

export default api;
