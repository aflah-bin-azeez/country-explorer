import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllCountries } from "../services/api";


const CountryCard = ({ country, onClick }) => (
  <div
    onClick={onClick}
    className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
  >
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
);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search country..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const Filters = ({ region, population, onRegionChange, onPopulationChange }) => {
  return (
    <div className="flex gap-4">
      <select
        value={region}
        onChange={(e) => onRegionChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Regions</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Oceania">Oceania</option>
      </select>

      <select
        value={population}
        onChange={(e) => onPopulationChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Population</option>
        <option value="lt10">Less than 10M</option>
        <option value="10to50">10M – 50M</option>
        <option value="gt50">More than 50M</option>
      </select>
    </div>
  );
};

const ITEMS_PER_PAGE = 12;

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [population, setPopulation] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllCountries({ signal: controller.signal });
        setCountries(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Countries API failed:", err);
          setError("Unable to load countries. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();

    return () => controller.abort();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, region, population]);

  // Memoized search callback
  const handleSearch = useCallback((query) => {
    setSearch(query);
  }, []);

  // Filter and search logic
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      // Search filter
      const matchesSearch =
        !search ||
        country.name?.common?.toLowerCase().includes(search.toLowerCase()) ||
        country.name?.official?.toLowerCase().includes(search.toLowerCase());

      // Region filter
      const matchesRegion = !region || country.region === region;

      // Population filter
      let matchesPopulation = true;
      if (population === "lt10") {
        matchesPopulation = country.population < 10000000;
      } else if (population === "10to50") {
        matchesPopulation =
          country.population >= 10000000 && country.population <= 50000000;
      } else if (population === "gt50") {
        matchesPopulation = country.population > 50000000;
      }

      return matchesSearch && matchesRegion && matchesPopulation;
    });
  }, [countries, search, region, population]);

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);

  const paginatedCountries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredCountries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCountries, page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!countries.length) {
    return <p className="text-center mt-10">No countries found.</p>;
  }

  return (
    <section className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">🌍 Country Explorer</h1>
        <span className="text-sm text-gray-500">
          {filteredCountries.length} countries
        </span>
      </header>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />
        <Filters
          region={region}
          population={population}
          onRegionChange={setRegion}
          onPopulationChange={setPopulation}
        />
      </div>

      {/* Results count */}
      {filteredCountries.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No countries match your filters. Try adjusting your search.
        </p>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(page * ITEMS_PER_PAGE, filteredCountries.length)} of{" "}
            {filteredCountries.length} results (Page {page} of {totalPages})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {paginatedCountries?.map((country) => (
              <CountryCard
                key={country?.cca3}
                country={country}
                onClick={() => alert(`Clicked: ${country?.name?.common}`)}
              />
            ))}
          </div>

          <footer className="flex justify-center gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Prev
            </button>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next →
            </button>
          </footer>
        </>
      )}
    </section>
  );
};

export default CountryList;