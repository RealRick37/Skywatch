function WeatherParticles({ condition }) {
  if (!["drizzle", "rain", "snow", "storm"].includes(condition)) {
    return null;
  }

  const particleCount =
    condition === "snow"
      ? 35
      : condition === "drizzle"
        ? 45
        : 65;

  return (
    <div
      className={`weather-particles weather-particles--${condition}`}
      aria-hidden="true"
    >
      {Array.from({ length: particleCount }, (_, index) => (
        <span
          key={index}
          className="weather-particles__particle"
          style={{
            "--particle-index": index,
          }}
        />
      ))}
    </div>
  );
}

export default WeatherParticles;