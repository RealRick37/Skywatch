import {CloudSun, Map, Menu, Settings, Star, X} from "lucide-react";

function Sidebar({ isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__top">
        <button
          className="sidebar__toggle"
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        <SidebarItem
          icon={<CloudSun />}
          label="Today"
          active
          isOpen={isOpen}
        />

        <SidebarItem
          icon={<Star />}
          label="Favorites"
          isOpen={isOpen}
        />

        <SidebarItem
          icon={<Map />}
          label="Weather map"
          isOpen={isOpen}
        />
      </nav>

      <div className="sidebar__bottom">
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          isOpen={isOpen}
        />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, isOpen }) {
  return (
    <button
      className={`sidebar__item ${
        active ? "sidebar__item--active" : ""
      }`}
      type="button"
      title={!isOpen ? label : undefined}
    >
      <span className="sidebar__item-icon">{icon}</span>

      {isOpen && (
        <span className="sidebar__item-label">{label}</span>
      )}
    </button>
  );
}

export default Sidebar;