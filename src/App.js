import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import CountryList from "./pages/CountryList";
import CountryDetails from "./pages/CountryDetails";
import { FavoritesProvider } from "./context/FavoritesContext";
import { getAllCountries } from "./services/api";
import './App.css';
import FavoritesPage from "./pages/Favorites";

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await getAllCountries();
        setCountries(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading countries...</p>
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CountryList countries={countries} />} />
          <Route path="/country/:code" element={<CountryDetails countries={countries} />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;