import "./LoadingScreen.css";

function LoadingScreen({ message = "Getting your local weather ready." }) {
  return (
    <section className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen__logo-wrap">
        <div className="loading-screen__glow" aria-hidden="true" />

        <img
          className="loading-screen__logo"
          src="/Skywatch.webp"
          alt="Skywatch"
          width="280"
          height="280"
          decoding="async"
        />
      </div>

      <div className="loading-screen__bar" aria-hidden="true" />

      <p className="loading-screen__message">{message}</p>
    </section>
  );
}

export default LoadingScreen;
