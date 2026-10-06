import {Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Snowflake, Sun} from "lucide-react";

export function getWeatherVisual(code) {
  if (code === 0) {
    return {
      type: "clear",
      icon: <Sun />,
    };
  }

  if ([1, 2].includes(code)) {
    return {
      type: "partly-cloudy",
      icon: <CloudSun />,
    };
  }

  if (code === 3) {
    return {
      type: "cloudy",
      icon: <Cloud />,
    };
  }

  if ([45, 48].includes(code)) {
    return {
      type: "fog",
      icon: <CloudFog />,
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      type: "drizzle",
      icon: <CloudRain />,
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      type: "rain",
      icon: <CloudRain />,
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      type: "snow",
      icon: <Snowflake />,
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      type: "storm",
      icon: <CloudLightning />,
    };
  }

  return {
    type: "clear",
    icon: <Sun />,
  };
}

function WeatherVisual({ weatherCode }) {
  const { type, icon } = getWeatherVisual(weatherCode);

  return (
    <div className={`weather-visual weather-visual--${type}`}>
      <div className="weather-visual__glow" />
      <div className="weather-visual__icon">
        {icon}
      </div>
    </div>
  );
}

export default WeatherVisual;