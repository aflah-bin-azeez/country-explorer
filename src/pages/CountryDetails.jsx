import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getWeatherByCity } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";

const CountryDetails = ({ countries = [] }) => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();

  const country = useMemo(
    () => countries.find((c) => c.cca3 === code),
    [countries, code]
  );

  useEffect(() => {
    const capital = country?.capital?.[0];
    if (!capital) return;

    setLoadingWeather(true);
    setError("");

    getWeatherByCity(capital)
      .then((res) => setWeather(res.data))
      .catch(() => setError("Failed to load weather data"))
      .finally(() => setLoadingWeather(false));
  }, [country]);

  if (!country) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading country details...
      </p>
    );
  }

  const favorite = isFavorite(country.cca3);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          ← Back to Countries
        </button>

        {/* 🏳️ Header Card */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{country.name?.common}</h1>
              <p className="opacity-90">{country.region}</p>
            </div>
            <button
              onClick={() => toggleFavorite(country)}
              className={`text-2xl transition-transform ${
                favorite ? "scale-125 text-yellow-400" : "text-white"
              }`}
              title={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? "★" : "☆"}
            </button>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <img
              src={country.flags?.svg}
              alt={country.name?.common}
              className="w-full max-h-64 object-contain rounded-lg border"
            />

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
              </p>

              <p>
                <strong>Population:</strong> {country.population?.toLocaleString()}
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {Object.values(country.languages || {}).join(", ") || "N/A"}
              </p>

              <p>
                <strong>Currencies:</strong>{" "}
                {Object.values(country.currencies || {})
                  .map((c) => c.name)
                  .join(", ") || "N/A"}
              </p>

              <p>
                <strong>Timezones:</strong> {country.timezones?.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* 🌤️ Weather Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            Weather in {country.capital?.[0]}
          </h3>

          {loadingWeather && <p className="text-gray-500">Loading weather...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {weather && !loadingWeather && (
            <div className="flex items-center gap-6 text-gray-700">
              <div className="text-4xl">
                {weather.weather?.[0]?.main === "Clouds" ? "☁️" : "🌤️"}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(weather.main?.temp)}°C
                </p>
                <p className="capitalize">{weather.weather?.[0]?.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
