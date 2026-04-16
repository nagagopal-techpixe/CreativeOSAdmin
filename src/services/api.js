import axios from "axios";

const API = axios.create({
  baseURL: "https://creativeos.bizmailo.com/api",
});

//  Attach token (except login)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token && !config.url.includes("/auth/admin/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//  Auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

export default API;
