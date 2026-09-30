import {CloudRain, Droplets, Eye, Gauge, Sun, Sunrise, Sunset, Wind} from "lucide-react";

function WeatherDetails({ weather }) {
  const { current, daily, units } = weather;

  const today = daily[0];

  return (
    <section className="weather-details">
      <div className="weather-details__header">
        <span className="weather-details__eyebrow">
          Conditions
        </span>
        <h2>Weather details</h2>
      </div>

      <div className="weather-details__grid">
        <div className="weather-detail weather-detail--sun">
          <div className="weather-detail__icon">
            <Sunrise />
          </div>

          <div className="weather-detail__content">
            <span>Sunrise</span>
            <strong>{formatTime(today.sunrise)}</strong>
          </div>

          <div className="weather-detail__icon">
            <Sunset />
          </div>

          <div className="weather-detail__content">
            <span>Sunset</span>
            <strong>{formatTime(today.sunset)}</strong>
          </div>
        </div>

        <WeatherDetailCard
          icon={<Sun />}
          label="UV Index"
          value={current.uv_index}
        />

        <WeatherDetailCard
          icon={<CloudRain />}
          label="Precipitation"
          value={`${current.precipitation} ${units.precipitation}`}
        />

        <WeatherDetailCard
          icon={<Droplets />}
          label="Humidity"
          value={`${current.humidity}${units.humidity}`}
        />

        <WeatherDetailCard
          icon={<Wind />}
          label="Wind"
          value={`${Math.round(current.wind_speed)} ${units.wind_speed}`}
        />

        <WeatherDetailCard
          icon={<Eye />}
          label="Visibility"
          value={`${(current.visibility / 1000).toFixed(1)} km`}
        />

        <WeatherDetailCard
          icon={<Gauge />}
          label="Pressure"
          value={`${Math.round(current.pressure)} ${units.pressure}`}
        />
      </div>
    </section>
  );
}

function WeatherDetailCard({ icon, label, value }) {
  return (
    <div className="weather-detail">
      <div className="weather-detail__icon">
        {icon}
      </div>

      <div className="weather-detail__content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default WeatherDetails;