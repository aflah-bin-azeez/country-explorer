import { useFavorites } from "../context/FavoritesContext";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CountryCard = ({ country, onClick }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(country.cca3);

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow relative">
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          toggleFavorite(country);
        }}
        className={`absolute top-2 right-2 text-2xl transition-transform ${
          favorite ? "text-yellow-400 scale-125" : "text-gray-300"
        }`}
        title={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>

      <div onClick={onClick} className="cursor-pointer">
        <img
          src={country.flags?.svg}
          alt={country.name?.common}
          className="w-full h-32 object-cover rounded mb-3"
        />
        <h3 className="font-semibold text-lg">{country.name?.common}</h3>
        <p className="text-sm text-gray-600">Region: {country.region}</p>
        <p className="text-sm text-gray-600">
          Population: {country.population?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <section className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">❤️ My Favorites</h1>
        <span className="text-sm text-gray-500">
          {favorites.length} {favorites.length === 1 ? "country" : "countries"}
        </span>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">No favorites yet!</p>
          <p className="text-gray-400 mb-6">
            Click the heart icon on any country to add it to your favorites.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {favorites.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              onClick={() => navigate(`/country/${country.cca3}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
