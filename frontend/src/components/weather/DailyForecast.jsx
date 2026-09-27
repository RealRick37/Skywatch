import {Cloud, CloudRain, CloudSun, Sun} from "lucide-react";

const dailyData = [
  { day: "Today", condition: "clear", high: 26, low: 17 },
  { day: "Mon", condition: "clear", high: 27, low: 18 },
  { day: "Tue", condition: "cloudy", high: 24, low: 16 },
  { day: "Wed", condition: "rain", high: 21, low: 15 },
  { day: "Thu", condition: "rain", high: 20, low: 14 },
  { day: "Fri", condition: "cloudy", high: 23, low: 16 },
  { day: "Sat", condition: "clear", high: 25, low: 17 },
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

function DailyForecast() {
  return (
    <section className="daily-forecast">
      <div className="daily-forecast__header">
        <div>
          <span className="daily-forecast__eyebrow">
            Outlook
          </span>

          <h2>7-day forecast</h2>
        </div>
      </div>

      <div className="daily-forecast__list">
        {dailyData.map((day, index) => (
          <article
            className={`daily-card ${
              index === 0 ? "daily-card--active" : ""
            }`}
            key={day.day}
          >
            <span className="daily-card__day">
              {day.day}
            </span>

            <div className="daily-card__icon">
              <WeatherIcon condition={day.condition} />
            </div>

            <div className="daily-card__temperatures">
              <strong>{day.high}°</strong>
              <span>{day.low}°</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DailyForecast;