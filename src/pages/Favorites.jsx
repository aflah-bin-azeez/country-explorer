import { useFavorites } from "../context/FavoritesContext";
import CountryCard from "../components/CountryCard";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <>
      <h2>Favorites</h2>
      <div className="grid">
        {favorites.map((c) => (
          <CountryCard key={c.cca3} country={c} />
        ))}
      </div>
    </>
  );
};

export default Favorites;
