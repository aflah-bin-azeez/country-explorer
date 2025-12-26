import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

const CountryCard = ({ country, onClick, toggleFavorite, isFavorite }) => {
    const favorite = isFavorite(country.cca3);

    return (
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(country);
                }}
                className={`absolute top-2 right-2 text-2xl transition-transform ${favorite ? "text-yellow-400 scale-125" : "text-gray-300"
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

const CountryList = ({ countries = [] }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("");
    const [population, setPopulation] = useState("");

    const { toggleFavorite, isFavorite, favorites } = useFavorites();

    useEffect(() => {
        setPage(1);
    }, [search, region, population]);

    const handleSearch = useCallback((query) => {
        setSearch(query);
    }, []);

    const filteredCountries = useMemo(() => {
        return countries.filter((country) => {
            const matchesSearch =
                !search ||
                country.name?.common?.toLowerCase().includes(search.toLowerCase()) ||
                country.name?.official?.toLowerCase().includes(search.toLowerCase());

            const matchesRegion = !region || country.region === region;

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

    const handleCountryClick = (country) => {
        navigate(`/country/${country.cca3}`);
    };

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
                <button
                    onClick={() => navigate("/favorites")}
                    className="px-3 py-1 border rounded-lg text-sm bg-yellow-400 text-white hover:bg-yellow-500 transition"
                >
                    { "Show All Favorites"}
                </button>
            </header>

            <div className="space-y-4">
                <SearchBar onSearch={handleSearch} />
                <Filters
                    region={region}
                    population={population}
                    onRegionChange={setRegion}
                    onPopulationChange={setPopulation}
                />
            </div>

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
                                onClick={() => handleCountryClick(country)}
                                toggleFavorite={toggleFavorite} 
                                isFavorite={isFavorite}
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
