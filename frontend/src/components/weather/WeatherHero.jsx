import { Droplets, Eye, Gauge, MapPin, Wind } from "lucide-react";
import RevealText from "../ui/RevealText";
import WeatherVisual from "./WeatherVisual";

function WeatherHero({ weather }) {
  const { location, current, units } = weather;

  const locationLabel = [location.name, location.country].filter(Boolean).join(", ") || location.timezone;

  return (
    <section className="weather-hero">
      <div className="weather-hero__ambient" />

      <div className="weather-hero__content">
        <div className="weather-hero__location">
          <MapPin size={17} strokeWidth={1.8} />

          <RevealText delay={150}>
            {locationLabel}
          </RevealText>
        </div>

        <div className="weather-hero__main">
          <WeatherVisual weatherCode={current.weather_code} />
          <RevealText
            className="weather-hero__temperature"
            delay={250}
          >
            {Math.round(current.temperature)}°
          </RevealText>

          <RevealText
            className="weather-hero__condition"
            delay={400}
          >
            {current.condition}
          </RevealText>

          <RevealText
            className="weather-hero__feels"
            delay={500}
          >
            Feels like {Math.round(current.feels_like)}°
          </RevealText>
        </div>

        <div className="weather-hero__stats">
          <WeatherStat
            icon={<Droplets />}
            label="Humidity"
            value={`${current.humidity}%`}
          />

          <WeatherStat
            icon={<Wind />}
            label="Wind"
            value={`${Math.round(current.wind_speed)} ${units.wind_speed}`}
          />

          <WeatherStat
            icon={<Gauge />}
            label="Pressure"
            value={`${Math.round(current.pressure)} ${units.pressure}`}
          />

          <WeatherStat
            icon={<Eye />}
            label="Visibility"
            value={`${(current.visibility / 1000).toFixed(1)} km`}
          />
        </div>
      </div>
    </section>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div className="weather-stat">
      <div className="weather-stat__icon">
        {icon}
      </div>

      <div className="weather-stat__content">
        <span className="weather-stat__label">
          {label}
        </span>

        <strong className="weather-stat__value">
          {value}
        </strong>
      </div>
    </div>
  );
}

export default WeatherHero;