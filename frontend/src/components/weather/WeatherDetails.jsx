import {CloudRain, Droplets, Eye, Gauge, Sun, Sunrise, Sunset, Wind} from "lucide-react";

const weatherDetails = {
  uvIndex: 4,
  precipitation: 0,
  humidity: 42,
  wind: 12,
  visibility: 10,
  pressure: 1014,
  sunrise: "05:42",
  sunset: "19:18",
};

function WeatherDetails() {
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
            <Sun />
          </div>

          <div className="weather-detail__content">
            <span>Sunrise</span>
            <strong>{weatherDetails.sunrise}</strong>
          </div>

          <Sunset className="weather-detail__secondary-icon" />

          <div className="weather-detail__content">
            <span>Sunset</span>
            <strong>{weatherDetails.sunset}</strong>
          </div>
        </div>

        <WeatherDetailCard
          icon={<Sun />}
          label="UV Index"
          value={weatherDetails.uvIndex}
        />

        <WeatherDetailCard
          icon={<CloudRain />}
          label="Precipitation"
          value={`${weatherDetails.precipitation}%`}
        />

        <WeatherDetailCard
          icon={<Droplets />}
          label="Humidity"
          value={`${weatherDetails.humidity}%`}
        />

        <WeatherDetailCard
          icon={<Wind />}
          label="Wind"
          value={`${weatherDetails.wind} km/h`}
        />

        <WeatherDetailCard
          icon={<Eye />}
          label="Visibility"
          value={`${weatherDetails.visibility} km`}
        />

        <WeatherDetailCard
          icon={<Gauge />}
          label="Pressure"
          value={`${weatherDetails.pressure} hPa`}
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

export default WeatherDetails;