
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("auth/login/") ||
      originalRequest.url?.includes("auth/register/") ||
      originalRequest.url?.includes("auth/refresh/")
    ) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(
        `${API_URL}auth/refresh/`,
        { refresh },
      );

      const newAccess = response.data.access;

      localStorage.setItem("access_token", newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.dispatchEvent(new Event("auth:logout"));

      return Promise.reject(refreshError);
    }
  },
);

export default api;
