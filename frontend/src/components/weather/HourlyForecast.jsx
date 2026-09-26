import {Cloud, CloudRain, CloudSun, Sun} from "lucide-react";

const hourlyData = [
  { time: "Now", temperature: 24, condition: "clear" },
  { time: "15:00", temperature: 25, condition: "clear" },
  { time: "16:00", temperature: 26, condition: "cloudy" },
  { time: "17:00", temperature: 25, condition: "cloudy" },
  { time: "18:00", temperature: 23, condition: "cloudy" },
  { time: "19:00", temperature: 21, condition: "rain" },
  { time: "20:00", temperature: 20, condition: "rain" },
  { time: "21:00", temperature: 19, condition: "clear" },
];

function WeatherIcon({ condition }) {
  const icons = {
    clear: <Sun />,
    cloudy: <CloudSun />,
    rain: <CloudRain />,
    overcast: <Cloud />,
  };

  return icons[condition] ?? <Cloud />;
}

function HourlyForecast() {
  return (
    <section className="hourly-forecast">
      <div className="hourly-forecast__header">
        <div>
          <span className="hourly-forecast__eyebrow">
            Forecast
          </span>

          <h2>Hourly forecast</h2>
        </div>

        <span className="hourly-forecast__hint">
          Next 24 hours
        </span>
      </div>

      <div className="hourly-forecast__list">
        {hourlyData.map((hour) => (
          <article
            className={`hourly-card ${
              hour.time === "Now" ? "hourly-card--active" : ""
            }`}
            key={hour.time}
          >
            <span className="hourly-card__time">
              {hour.time}
            </span>

            <div className="hourly-card__icon">
              <WeatherIcon condition={hour.condition} />
            </div>

            <strong className="hourly-card__temperature">
              {hour.temperature}°
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HourlyForecast;