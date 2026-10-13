function seeded(index, salt) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function WeatherParticles({ condition }) {
  if (!["drizzle", "rain", "snow", "storm"].includes(condition)) {
    return null;
  }

  const isSnow = condition === "snow";
  const particleCount = isSnow ? 45 : condition === "drizzle" ? 55 : 80;

  return (
    <div
      className={`weather-particles weather-particles--${condition}`}
      aria-hidden="true"
    >
      {Array.from({ length: particleCount }, (_, index) => {
        const style = {
          left: `${seeded(index, 1) * 100}%`,
          animationDelay: `${-seeded(index, 2) * (isSnow ? 8 : 1.2)}s`,
        };

        if (isSnow) {
          const size = 3 + seeded(index, 3) * 4;
          style.width = `${size}px`;
          style.height = `${size}px`;
        } else {
          style.scale = `1 ${0.7 + seeded(index, 3) * 0.7}`;
        }

        return (
          <span
            key={index}
            className="weather-particles__particle"
            style={style}
          />
        );
      })}
    </div>
  );
}

export default WeatherParticles;