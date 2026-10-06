import { useRef } from "react";
import { Droplets, Eye, Gauge, MapPin, Wind } from "lucide-react";
import RevealText from "../ui/RevealText";
import WeatherVisual from "./WeatherVisual";

function WeatherHero({ weather, condition, night }) {
  const heroRef = useRef(null);
  const { location, current, units } = weather;

  const locationLabel =
    [location.name, location.country].filter(Boolean).join(", ") ||
    location.timezone;

  const handlePointerMove = (event) => {
    const el = heroRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <section
      key={`${locationLabel}-${current.time}`}
      ref={heroRef}
      className="weather-hero"
      data-weather={condition}
      data-night={night}
      onPointerMove={handlePointerMove}
    >
      <div className="weather-hero__ambient" />
      <div className="weather-hero__flare" />

      <div className="weather-hero__content">
        <div className="weather-hero__location">
          <MapPin size={15} strokeWidth={1.8} />
          <RevealText delay={150}>{locationLabel}</RevealText>
        </div>

        <div className="weather-hero__main">
          <WeatherVisual weatherCode={current.weather_code} />

          <RevealText className="weather-hero__temperature" delay={250}>
            {Math.round(current.temperature)}
            <span className="weather-hero__degree">°</span>
          </RevealText>

          <RevealText className="weather-hero__condition" delay={450}>
            {current.condition}
          </RevealText>

          <RevealText className="weather-hero__feels" delay={600}>
            Feels like {Math.round(current.feels_like)}°
          </RevealText>
        </div>

        <div className="weather-hero__stats">
          <WeatherStat index={0} icon={<Droplets />} label="Humidity" value={`${current.humidity}%`} />
          <WeatherStat index={1} icon={<Wind />} label="Wind" value={`${Math.round(current.wind_speed)} ${units.wind_speed}`} />
          <WeatherStat index={2} icon={<Gauge />} label="Pressure" value={`${Math.round(current.pressure)} ${units.pressure}`} />
          <WeatherStat index={3} icon={<Eye />} label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
        </div>
      </div>
    </section>
  );
}

function WeatherStat({ icon, label, value, index }) {
  return (
    <div
      className="weather-stat"
      style={{ "--reveal-delay": `${750 + index * 90}ms` }}
    >
      <div className="weather-stat__icon">{icon}</div>

      <div className="weather-stat__content">
        <span className="weather-stat__label">{label}</span>
        <strong className="weather-stat__value">{value}</strong>
      </div>
    </div>
  );
}

export default WeatherHero;