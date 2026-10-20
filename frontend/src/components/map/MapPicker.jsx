import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPicker.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function MapPicker({
  onSelectLocation,
  initialPosition = [40.4093, 49.8671],
}) {
  const [position, setPosition] = useState(null);

  return (
    <section className="map-picker">
      <div className="map-picker__header">
        <h2>Explore the map</h2>
        <p>Click anywhere on the map to select a location.</p>
      </div>

      <MapContainer
        center={initialPosition}
        zoom={5}
        className="map-picker__map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector onSelect={setPosition} />

        {position && (
          <Marker position={[position.latitude, position.longitude]} icon={defaultIcon} />
        )}
      </MapContainer>

      <div className="map-picker__footer">
        <div className="map-picker__coordinates">
          {position ? (
            <>
              <span>Latitude: {position.latitude.toFixed(5)}</span>
              <span>Longitude: {position.longitude.toFixed(5)}</span>
            </>
          ) : (
            <span>Select a location to continue.</span>
          )}
        </div>

        <button
          className="map-picker__button"
          disabled={!position}
          onClick={() => {
            onSelectLocation(position);
          }}
        >
          Get weather here
        </button>
      </div>
    </section>
  );
}