import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWeatherByCity } from "../services/api";

const CountryDetails = ({ countries }) => {
  const { code } = useParams();
  const country = countries.find((c) => c.cca3 === code);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (country?.capital?.[0]) {
      getWeatherByCity(country.capital[0])
        .then((res) => setWeather(res.data))
        .catch(() => setWeather(null));
    }
  }, [country]);

  if (!country) return <p>Loading...</p>;

  return (
    <>
      <img src={country.flags.svg} alt={country.name.common} width="200" />
      <h2>{country.name.common}</h2>

      <p>Languages: {Object.values(country.languages || {}).join(", ")}</p>
      <p>Currencies: {Object.values(country.currencies || {})
        .map((c) => c.name)
        .join(", ")}</p>

      {weather && (
        <>
          <h3>Weather</h3>
          <p>{weather.main.temp} °C</p>
          <p>{weather.weather[0].description}</p>
        </>
      )}
    </>
  );
};

export default CountryDetails;
