import { useFavorites } from "../context/FavoritesContext";

const CountryCard = ({ country, onClick }) => {
  const { favorites, toggleFavorite } = useFavorites();

  const isFav = favorites.some(
    (fav) => fav?.cca3 === country?.cca3
  );

  const handleFavorite = (e) => {
    e.stopPropagation(); 
    toggleFavorite(country);
  };

  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden border bg-white
                 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-40 w-full bg-gray-100 overflow-hidden">
        <img
          src={country?.flags?.png || ""}
          alt={country?.name?.common || "Country flag"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate">
          {country?.name?.common || "Unknown Country"}
        </h3>

        <p className="text-sm text-gray-600">
          <strong>Capital:</strong> {country?.capital?.[0] || "N/A"}
        </p>

        <p className="text-sm text-gray-600">
          <strong>Region:</strong> {country?.region || "N/A"}
        </p>

        <p className="text-sm text-gray-600">
          <strong>Population:</strong>{" "}
          {country?.population
            ? country.population.toLocaleString()
            : "N/A"}
        </p>

        <div className="flex justify-between items-center pt-3">
          <button
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            View Details
          </button>

          <button
            onClick={handleFavorite}
            aria-label="Toggle Favorite"
            className="text-lg"
          >
            {isFav ? "⭐" : "☆"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CountryCard;
