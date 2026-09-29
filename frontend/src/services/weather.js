import api from "../api";

export const getWeather = (latitude, longitude) => {
  return api.get("weather/", {
    params: {
      latitude,
      longitude,
    },
  });
};

export const searchCity = (name) => {
  return api.get("weather/search/", {
    params: {
      name,
    },
  });
};