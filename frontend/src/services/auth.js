import api from "../api";

export const register = (data) => {
  return api.post("auth/register/", data);
};

export const login = (data) => {
  return api.post("auth/login/", data);
};

export const refreshToken = (refresh) => {
  return api.post("auth/refresh/", { refresh });
};

export const getCurrentUser = () => {
  return api.get("auth/me/");
};
