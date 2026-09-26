function SkyBackground({ condition = "clear", isNight = false }) {
  const backgroundClass = [
    "sky-background",
    `sky-background--${condition}`,
    isNight ? "sky-background--night" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={backgroundClass} aria-hidden="true">
      <div className="sky-background__glow sky-background__glow--one" />
      <div className="sky-background__glow sky-background__glow--two" />
      <div className="sky-background__orb" />
    </div>
  );
}

export default SkyBackground;