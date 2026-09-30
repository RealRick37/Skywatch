import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

function WeatherIcon({ code }) {
  if (code === 0) return <Sun />;
  if (code <= 2) return <CloudSun />;
  if (code === 3) return <Cloud />;
  if (code >= 51 && code <= 67) return <CloudRain />;
  if (code >= 71 && code <= 77) return <CloudSnow />;
  if (code >= 80 && code <= 82) return <CloudRain />;
  if (code >= 95) return <CloudLightning />;
  return <Cloud />;
}

function DailyForecast({ weather }) {
  const { daily, units } = weather;

  return (
    <section className="daily-forecast">
      <div className="daily-forecast__header">
        <div>
          <span className="daily-forecast__eyebrow">Outlook</span>
          <h2>7-day forecast</h2>
        </div>
      </div>

      <div className="daily-forecast__list">
        {daily.map((day, index) => (
          <article
            className={`daily-card ${
              index === 0 ? "daily-card--active" : ""
            }`}
            key={day.date}
          >
            <span className="daily-card__day">
              {index === 0
                ? "Today"
                : new Date(`${day.date}T12:00:00`).toLocaleDateString(
                    [],
                    { weekday: "short" }
                  )}
            </span>

            <div className="daily-card__icon">
              <WeatherIcon code={day.weather_code} />
            </div>

            <div className="daily-card__temperatures">
              <strong>
                {Math.round(day.temperature_max)}
                {units.temperature}
              </strong>

              <span>
                {Math.round(day.temperature_min)}
                {units.temperature}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DailyForecast;