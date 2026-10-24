import {Droplets, MapPin, Trash2, Wind} from "lucide-react";
import { getWeatherVisual } from "../weather/WeatherVisual";

function FavoriteWeatherCard({ favorite, onDelete, onSelect, isDeleting }) {
  const { weather, units } = favorite;
  const visual = getWeatherVisual(weather.weather_code);

  return (
    <article
      className={`favorite-card favorite-card--${visual.type}`}
      onClick={() => onSelect(favorite)}
    >
      <div className="favorite-card__glow" />

      <div className="favorite-card__top">
        <div>
          <div className="favorite-card__location">
            <MapPin size={15} />
            <span>{favorite.name}</span>
          </div>

          <span className="favorite-card__country">
            {favorite.country}
          </span>
        </div>

        <button
          type="button"
          className="favorite-card__delete"
          disabled={isDeleting}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(favorite.id);
          }}
          aria-label={`Remove ${favorite.name} from favorites`}
        >
          <Trash2 size={17} />
        </button>
      </div>

      <div className="favorite-card__weather">
        <div className="favorite-card__visual">
          {visual.icon}
        </div>

        <div>
          <strong className="favorite-card__temperature">
            {Math.round(weather.temperature)}°
          </strong>

          <span className="favorite-card__condition">
            {weather.condition}
          </span>
        </div>
      </div>

      <div className="favorite-card__meta">
        <div>
          <Droplets size={15} />
          <span>{weather.humidity}%</span>
        </div>

        <div>
          <Wind size={15} />
          <span>
            {Math.round(weather.wind_speed)} {units.wind_speed}
          </span>
        </div>
      </div>
    </article>
  );
}

export default FavoriteWeatherCard;