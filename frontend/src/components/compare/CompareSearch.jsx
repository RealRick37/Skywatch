
import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { searchCity } from "../../services/weather";

function CompareSearch({ locations, onAdd, onRemove }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();

    const value = query.trim();
    if (!value || loading) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await searchCity(value);
      setResults(response.data.results ?? []);
    } catch (err) {
      console.error("City search error:", err);
      setError("Could not search for this city.");
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (city) =>
    locations.some(
      (location) =>
        Math.abs(location.latitude - city.latitude) < 0.01 &&
        Math.abs(location.longitude - city.longitude) < 0.01
    );

  return (
    <section className="compare-search">
      <form onSubmit={handleSearch} className="compare-search__form">
        <Search size={18} />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a city..."
          aria-label="Search for a city to compare"
        />

        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="compare-search__error">{error}</p>}

      {results.length > 0 && (
        <div className="compare-search__results">
          {results.map((city) => (
            <div
              className="compare-search__result"
              key={city.id}
            >
              <div>
                <strong>{city.name}</strong>
                <span>
                  {[city.admin1, city.country].filter(Boolean).join(", ")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAdd(city)}
                disabled={isSelected(city) || locations.length >= 4}
                aria-label={`Add ${city.name}`}
              >
                <Plus size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="compare-search__selected">
        {locations.map((city) => (
          <div className="compare-search__chip" key={city.id}>
            <span>{city.name}</span>
            <button
              type="button"
              onClick={() => onRemove(city)}
              aria-label={`Remove ${city.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <p className="compare-search__hint">
        Select 2 to 4 cities to compare their weather.
      </p>
    </section>
  );
}

export default CompareSearch;
