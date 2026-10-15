import api from "../api";

export const getWeather = (latitude, longitude) => {
  return api.get("weather/", {
    params: { latitude, longitude },
  });
};

export const searchCity = (name) => {
  return api.get("weather/search/", {
    params: { name },
  });
};

export const reverseGeocode = async (latitude, longitude) => {
  const url =
    "https://api.bigdatacloud.net/data/reverse-geocode-client" +
    `?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Reverse geocoding failed");

  const data = await response.json();

  return {
    name: data.city || data.locality || null,
    country: data.countryName || null,
  };
};

export const getFavoriteWeather = () => {
  return api.get("weather/favorites/weather/");
};

export const deleteFavorite = (id) => {
  return api.delete(`weather/favorites/${id}/`);
};

export const addFavorite = (location) => {
  return api.post("weather/favorites/", location);
};