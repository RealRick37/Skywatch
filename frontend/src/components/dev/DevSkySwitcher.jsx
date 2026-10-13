const SKIES = ["clear", "cloudy", "fog", "drizzle", "rain", "snow", "storm"];

function DevSkySwitcher({ sky, night, onSky, onNight }) {
  return (
    <div className="dev-switcher">
      {SKIES.map((item) => (
        <button
          key={item}
          type="button"
          className={sky === item ? "is-active" : ""}
          onClick={() => onSky(sky === item ? null : item)}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        className={night === false ? "is-active" : ""}
        onClick={() => onNight(night === false ? null : false)}
      >
        day
      </button>

      <button
        type="button"
        className={night === true ? "is-active" : ""}
        onClick={() => onNight(night === true ? null : true)}
      >
        night
      </button>
    </div>
  );
}

export default DevSkySwitcher;