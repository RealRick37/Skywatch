import {Droplets, Eye, Gauge, MapPin, Wind} from "lucide-react";
import RevealText from "../ui/RevealText";

const weatherData={
    city: "Tehran",
    country: "Iran",
    temperature: 24,
    feelsLike: 25,
    condition: "Clear sky",
    humidity: 42,
    wind: 12,
    pressure: 1014,
    visibility: 10000,
};

function WeatherHero() {
  return (
    <section className="weather-hero">
      <div className="weather-hero__location">
        <RevealText delay={100}>
            <MapPin size={18} />
        </RevealText>

        <RevealText delay={150}>
            {weatherData.city}, {weatherData.country}
        </RevealText>
        </div>

        <div className="weather-hero__main">
        <RevealText
            className="weather-hero__temperature"
            delay={250}
        >
            {weatherData.temperature}°
        </RevealText>

        <RevealText
            className="weather-hero__condition"
            delay={400}
        >
            {weatherData.condition}
        </RevealText>

        <RevealText
            className="weather-hero__feels"
            delay={500}
        >
            Feels like {weatherData.feelsLike}°
        </RevealText>
        </div>

      <div className="weather-hero__stats">
        <WeatherStat
          icon={<Droplets />}
          label="Humidity"
          value={`${weatherData.humidity}%`}
        />

        <WeatherStat
          icon={<Wind />}
          label="Wind"
          value={`${weatherData.wind} km/h`}
        />

        <WeatherStat
          icon={<Gauge />}
          label="Pressure"
          value={`${weatherData.pressure} hPa`}
        />

        <WeatherStat
          icon={<Eye />}
          label="Visibility"
          value={`${weatherData.visibility / 1000} km`}
        />
      </div>
    </section>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div className="weather-stat">
      <div className="weather-stat__icon">{icon}</div>

      <div>
        <span className="weather-stat__label">{label}</span>
        <strong className="weather-stat__value">{value}</strong>
      </div>
    </div>
  );
}

export default WeatherHero;