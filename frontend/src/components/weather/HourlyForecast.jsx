import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

function WeatherIcon({ condition }) {
  const icons = {
    clear: <Sun />,
    cloudy: <CloudSun />,
    rain: <CloudRain />,
    overcast: <Cloud />,
  };

  return icons[condition] ?? <Cloud />;
}

function HourlyForecast({ weather }) {
  const { current, hourly, units } = weather;

  const currentIndex = hourly.findIndex(
    (hour) => hour.time >= current.time
  );

  const visibleHours = hourly.slice(
    currentIndex === -1 ? 0 : currentIndex,
    (currentIndex === -1 ? 0 : currentIndex) + 24
  );

  return (
    <section className="hourly-forecast">
      <div className="hourly-forecast__header">
        <div>
          <span className="hourly-forecast__eyebrow">Forecast</span>
          <h2>Hourly forecast</h2>
        </div>

        <span className="hourly-forecast__hint">
          Next 24 hours
        </span>
      </div>

      <div className="hourly-forecast__list">
        {visibleHours.map((hour, index) => (
          <article
            className={`hourly-card ${
              index === 0 ? "hourly-card--active" : ""
            }`}
            key={hour.time}
          >
            <span className="hourly-card__time">
              {index === 0
                ? "Now"
                : new Date(hour.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>

            <div className="hourly-card__icon">
              <WeatherIcon condition={hour.condition} />
            </div>

            <strong className="hourly-card__temperature">
              {Math.round(hour.temperature)}
              {units.temperature}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HourlyForecast;