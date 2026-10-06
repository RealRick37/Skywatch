import { useEffect, useMemo, useRef, useState } from "react";
import { getWeatherVisual } from "./WeatherVisual";

const HOURS = 12;
const W = 1000;
const H = 100;
const PAD_TOP = 22;
const PAD_BOTTOM = 8;

function getUpcomingHours(weather) {
  const { hourly, current } = weather;
  const nowHour = `${current.time.slice(0, 13)}:00`;
  const start = Math.max(
    0,
    hourly.findIndex((hour) => hour.time >= nowHour)
  );

  return hourly.slice(start, start + HOURS);
}

function buildChart(temps) {
  const count = temps.length;
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const points = temps.map((temp, index) => ({
    x: ((index + 0.5) / count) * W,
    y: PAD_TOP + (1 - (temp - min) / range) * (H - PAD_TOP - PAD_BOTTOM),
  }));

  let line = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const next = points[i];
    const mid = (prev.x + next.x) / 2;
    line += ` C${mid},${prev.y} ${mid},${next.y} ${next.x},${next.y}`;
  }

  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L${last.x},${H} L${first.x},${H} Z`;

  return { points, line, area };
}

function HourlyForecast({ weather }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const hours = useMemo(() => getUpcomingHours(weather), [weather]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (hours.length < 2) return null;

  const temps = hours.map((hour) => Math.round(hour.temperature));
  const { points, line, area } = buildChart(temps);
  const { latitude, longitude } = weather.location;

  return (
    <section className="hourly-forecast">
      <div className="hourly-forecast__header">
        <div>
          <span className="hourly-forecast__eyebrow">Next 12 hours</span>
          <h2>Hourly forecast</h2>
        </div>

        <span className="hourly-forecast__hint">Temperature trend</span>
      </div>

      <div
        ref={sectionRef}
        className={`hourly-chart ${visible ? "is-visible" : ""}`}
      >
        <div className="hourly-chart__scroll">
          <div
            key={`${latitude}-${longitude}-${hours[0].time}`}
            className="hourly-chart__inner"
            style={{ "--count": hours.length }}
          >
            <div className="hourly-chart__labels">
              {hours.map((hour, index) => (
                <div
                  key={hour.time}
                  className={`hourly-chart__label ${
                    index === 0 ? "hourly-chart__label--now" : ""
                  }`}
                  style={{ "--i": index }}
                >
                  <span>{index === 0 ? "Now" : `${hour.time.slice(11, 13)}:00`}</span>
                  <span className="hourly-chart__icon">
                    {getWeatherVisual(hour.weather_code).icon}
                  </span>
                </div>
              ))}
            </div>

            <div className="hourly-chart__plot">
              <div className="hourly-chart__layer hourly-chart__layer--fill">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="hc-fill"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={H}
                    >
                      <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="hourly-chart__area" d={area} />
                </svg>
              </div>

              <div className="hourly-chart__layer hourly-chart__layer--line">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="hc-line"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2={W}
                      y2="0"
                    >
                      <stop offset="0" stopColor="currentColor" stopOpacity="0.5" />
                      <stop offset="0.5" stopColor="currentColor" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <path className="hourly-chart__glow" d={line} />
                  <path className="hourly-chart__stroke" d={line} />
                </svg>
              </div>

              {points.map((point, index) => (
                <div
                  key={hours[index].time}
                  className={`hourly-chart__point ${
                    index === 0 ? "hourly-chart__point--now" : ""
                  }`}
                  style={{
                    left: `${(point.x / W) * 100}%`,
                    top: `${(point.y / H) * 100}%`,
                    "--i": index,
                  }}
                >
                  <strong className="hourly-chart__temp">{temps[index]}°</strong>
                  <span className="hourly-chart__dot" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HourlyForecast;