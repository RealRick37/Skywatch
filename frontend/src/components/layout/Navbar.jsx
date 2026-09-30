import { useState } from "react";
import { CloudSun, MapPin, Search, X } from "lucide-react";

function Navbar({ onSearch }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
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
              onClick={() => {
                setIsSearchOpen(false);
                setQuery("");
              }}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>
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