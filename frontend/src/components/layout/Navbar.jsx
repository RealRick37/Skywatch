import { useState } from "react";
import { CloudSun, MapPin, Search, X } from "lucide-react";

function Navbar({onSearch, searchResults, searchLoading}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
  };

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
          <span>Detecting location...</span>
        </div>

        {isSearchOpen ? (
          <div className="navbar__search-wrapper">
            <form
              className="navbar__search-form"
              onSubmit={handleSubmit}
            >
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
            </form>

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