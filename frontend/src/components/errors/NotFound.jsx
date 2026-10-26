import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__stars" aria-hidden="true" />
      <div className="not-found__stars not-found__stars--far" aria-hidden="true" />

      <div className="not-found__moon" aria-hidden="true" />

      <div className="not-found__content">
        <p className="not-found__eyebrow">
          SIGNAL LOST · BEYOND THE KNOWN SKY
        </p>

        <h1 className="not-found__code">404</h1>

        <h2 className="not-found__title">
          Lost beyond the Wall.
        </h2>

        <p className="not-found__description">
          Looks like you've wandered into uncharted skies.
          The page you're looking for doesn't exist or has
          drifted into the darkness.
        </p>

        <Link to="/" className="not-found__button">
          <span aria-hidden="true">←</span>
          Return to Skywatch
        </Link>
      </div>

      <div className="not-found__horizon" aria-hidden="true">
        <div className="not-found__tower">
          <span className="not-found__tower-light" />
        </div>
        <div className="not-found__mountains" />
      </div>

      <p className="not-found__footer">
        THE NIGHT IS DARK AND FULL OF ERRORS.
      </p>
    </main>
  );
}

export default NotFound;
