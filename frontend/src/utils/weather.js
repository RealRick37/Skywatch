export function getWeatherCondition(weather) {
  const code = weather?.current?.weather_code;

  if (code === undefined || code === null) return "clear";
  if ([0, 1].includes(code)) return "clear";
  if ([2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";

  return "clear";
}


export function isNight(weather) {
  const time = weather?.current?.time;
  if (!time) return false;

  const today =
    weather.daily?.find((day) => day.date === time.slice(0, 10)) ??
    weather.daily?.[0];

  if (!today?.sunrise || !today?.sunset) return false;

  const now = time.slice(11, 16);
  const sunrise = today.sunrise.slice(11, 16);
  const sunset = today.sunset.slice(11, 16);

  return now < sunrise || now >= sunset;
}