import axios from "axios";

const COUNTRIES_BASE = "https://restcountries.com/v3.1";
const WEATHER_BASE = "https://api.openweathermap.org/data/2.5";

export const getAllCountries = () => {
  const fields = "name,capital,region,subregion,population,flags,cca3,languages,currencies,timezones";
  return axios.get(`${COUNTRIES_BASE}/all?fields=${fields}`);
};
export const getWeatherByCity = (city) => {
  if (!city) {
    return Promise.reject(new Error("City name is required"));
  }

  return axios.get(`${WEATHER_BASE}/weather`, {
    params: {
      q: city,
      units: "metric",
      appid: process.env.REACT_APP_WEATHER_API_KEY,
    },
  });
};