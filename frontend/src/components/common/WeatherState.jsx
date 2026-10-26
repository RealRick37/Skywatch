import { CloudOff, RefreshCw } from "lucide-react";
import "./WeatherState.css";

function WeatherState({ type = "error", title, message, onRetry }) {
  const isLoading = type === "loading";

  return (
    <section
      className={`weather-state weather-state--${type}`}
      role={isLoading ? "status" : "alert"}
    >
      <div className="weather-state__icon" aria-hidden="true">
        {isLoading ? (
          <RefreshCw className="weather-state__spinner" size={28} />
        ) : (
          <CloudOff size={28} />
        )}
      </div>

      <h2 className="weather-state__title">
        {title ??
          (isLoading ? "Reading the skies..." : "The skies are unclear")}
      </h2>

      <p className="weather-state__message">
        {message ??
          (isLoading
            ? "Gathering the latest weather conditions."
            : "We couldn't retrieve the weather data. Check your connection and try again.")}
      </p>

      {!isLoading && onRetry && (
        <button
          className="weather-state__retry"
          type="button"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try again
        </button>
      )}
    </section>
  );
}

export default WeatherState;