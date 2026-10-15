import { useEffect, useState } from "react";
import { CloudSun, MapPin, Search, X, LocateFixed } from "lucide-react";

function Navbar({onSearch, searchResults, searchLoading, onSelectCity, locationName, locationError, user, onAuthClick, onLogout, onReturnToCurrentLocation, isCurrentLocation}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSelectCity = (city) => {
    onSelectCity(city);
    setIsSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      onSearch("");
      return;
    }

    const timer = setTimeout(() => {
      onSearch(trimmedQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand">
          <CloudSun size={28} strokeWidth={1.8} />
          <span>Skywatch</span>
        </a>

        <div className="navbar__location">
          <MapPin size={17} strokeWidth={2} />
          {locationName ??
            (locationError ? "Location unavailable" : "Current location")}
          
          <button
            type="button"
            className="navbar__current-location"
            onClick={onReturnToCurrentLocation}
            disabled={isCurrentLocation || !onReturnToCurrentLocation}
            title="Return to current location"
            aria-label="Return to current location"
          >
            <LocateFixed size={17} />
          </button>
        </div>

        <div className="navbar__account">
          {user ? (
            <>
              <span className="navbar__username">
                {user.username}
              </span>

              <button
                className="navbar__auth-button"
                type="button"
                onClick={onLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="navbar__auth-button"
              type="button"
              onClick={onAuthClick}
            >
              Sign in
            </button>
          )}
        </div>

        {isSearchOpen ? (
          <div className="navbar__search-wrapper">
            <div className="navbar__search-form">
              <Search size={18} strokeWidth={2} />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city..."
                autoFocus
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {searchLoading && (
              <div className="navbar__search-dropdown">
                <div className="navbar__search-status">
                  Searching...
                </div>
              </div>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="navbar__search-dropdown">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="navbar__search-result"
                    type="button"
                    onClick={() => handleSelectCity(result)}
                  >
                    <div className="navbar__search-result-main">
                      <strong>{result.name}</strong>

                      <span>
                        {result.admin1
                          ? `${result.admin1}, ${result.country}`
                          : result.country}
                      </span>
                    </div>

                    <MapPin size={16} />
                  </button>
                ))}
              </div>
            )}

            {!searchLoading &&
              query.trim() &&
              searchResults.length === 0 && (
                <div className="navbar__search-dropdown">
                  <div className="navbar__search-status">
                    No cities found.
                  </div>
                </div>
              )}
          </div>
        ) : (
          <button
            className="navbar__search"
            type="button"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={19} strokeWidth={2} />
            <span>Search city</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;