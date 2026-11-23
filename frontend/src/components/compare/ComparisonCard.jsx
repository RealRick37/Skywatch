import {Droplets, Wind, Gauge, Thermometer, Eye, Sun, AlertCircle} from "lucide-react";
import { getWeatherCondition } from "../../utils/weather";

function ComparisonCard({ result }) {
  const { location, current, units, error } = result;

  if (error) {
    return (
      <article className="comparison-card comparison-card--error">
        <div className="comparison-card__header">
          <div>
            <h3>{location.name}</h3>
            <p>{location.country}</p>
          </div>
        </div>

        <div className="comparison-card__error">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      </article>
    );
  }

  const condition = getWeatherCondition(current.weather_code);
  const temperature = Math.round(current.temperature);

  const details = [
    {
      icon: <Thermometer />,
      label: "Feels like",
      value: `${Math.round(current.feels_like)}${units.temperature}`,
    },
    {
      icon: <Droplets />,
      label: "Humidity",
      value: `${current.humidity}${units.humidity}`,
    },
    {
      icon: <Wind />,
      label: "Wind",
      value: `${current.wind_speed} ${units.wind_speed}`,
    },
    {
      icon: <Gauge />,
      label: "Pressure",
      value: `${current.pressure} ${units.pressure}`,
    },
    {
      icon: <Eye />,
      label: "Visibility",
      value: `${current.visibility} ${units.visibility}`,
    },
    {
      icon: <Sun />,
      label: "UV Index",
      value: current.uv_index,
    },
  ];

  return (
    <article className="comparison-card">
      <div className="comparison-card__header">
        <div>
          <h3>{location.name}</h3>
          <p>{location.country}</p>
        </div>
      </div>

      <div className="comparison-card__weather">
        <div className="comparison-card__temperature">
          {temperature}°
        </div>

        <div className="comparison-card__condition">
          <span>{condition?.label ?? current.condition}</span>
          <span>
            Feels like {Math.round(current.feels_like)}°
          </span>
        </div>
      </div>

      <div className="comparison-card__details">
        {details.map((item) => (
          <div className="comparison-card__detail" key={item.label}>
            {item.icon}
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ComparisonCard;
