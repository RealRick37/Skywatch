import { CloudSun, MapPin, Search } from "lucide-react";

function Navbar() {
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

        <button className="navbar__search" type="button">
          <Search size={19} strokeWidth={2} />
          <span>Search city</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;