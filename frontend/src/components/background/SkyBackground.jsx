function SkyBackground({ condition = "clear", isNight = false }) {
  const classes = [
    "sky-background",
    `sky-background--${condition}`,
    isNight && "sky-background--night",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <div className="sky-background__mesh" />
      <div className="sky-background__orb sky-background__orb--one" />
      <div className="sky-background__orb sky-background__orb--two" />
      <div className="sky-background__noise" />
    </div>
  );
}

export default SkyBackground;