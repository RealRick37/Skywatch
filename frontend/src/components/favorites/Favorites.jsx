import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import FavoriteWeatherCard from "./FavoriteWeatherCard";
import {deleteFavorite, getFavoriteWeather} from "../../services/weather";
import "./Favorites.css";

function Favorites({ onSelectCity }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFavoriteWeather();
      setFavorites(response.data.results ?? []);
    } catch (err) {
      console.error("Favorites error:", err);
      setError("Failed to load your favorite locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFavorite(id);
      setFavorites((current) =>
        current.filter((favorite) => favorite.id !== id)
      );
    } catch (err) {
      console.error("Delete favorite error:", err);
    }
  };

  const handleSelect = (favorite) => {
    onSelectCity({
      name: favorite.name,
      country: favorite.country,
      latitude: favorite.latitude,
      longitude: favorite.longitude,
    });
  };

  return (
    <section className="favorites-page">
      <header className="favorites-page__header">
        <div>
          <span className="favorites-page__eyebrow">
            Saved locations
          </span>

          <h1>Favorites</h1>

          <p>
            Keep an eye on the places that matter to you.
          </p>
        </div>

        <div className="favorites-page__icon">
          <Star size={22} />
        </div>
      </header>

      {loading && (
        <div className="favorites-page__state">
          <span className="favorites-page__loader" />
          <p>Loading your favorites...</p>
        </div>
      )}

      {!loading && error && (
        <div className="favorites-page__state favorites-page__state--error">
          <p>{error}</p>

          <button type="button" onClick={loadFavorites}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="favorites-page__empty">
          <div className="favorites-page__empty-icon">
            <Star size={28} />
          </div>

          <h2>No favorite locations yet</h2>

          <p>
            Search for a city and save it here to keep its weather
            close at hand.
          </p>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <FavoriteWeatherCard
              key={favorite.id}
              favorite={favorite}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;