import './App.css'
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import WeatherHero from "./components/weather/WeatherHero";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherDetails from './components/weather/WeatherDetails';
import SkyBackground from "./components/background/SkyBackground";
import Favorites from "./components/favorites/Favorites";
import { getWeather, searchCity, reverseGeocode } from "./services/weather";
import { getWeatherCondition, isNight } from "./utils/weather";

function getLocationErrorMessage(error) {
  switch (error.code) {
    case 1:
      return "Location permission was denied. Search for a city to continue.";
    case 2:
      return "Your location is unavailable. Search for a city to continue.";
    case 3:
      return "Location request timed out. Search for a city to continue.";
    default:
      return "Could not detect your location. Search for a city to continue.";
  }
}

function App() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const condition = getWeatherCondition(weather);
  const night = isNight(weather);

  const [activeView, setActiveView] = useState("today");

  const loadWeather = useCallback(async (latitude, longitude, cityName) => {
    setWeatherLoading(true);
    setError(null);

    try {
      const [response, place] = await Promise.all([
        getWeather(latitude, longitude),
        cityName
          ? Promise.resolve(null)
          : reverseGeocode(latitude, longitude).catch(() => null),
      ]);

      const data = response.data;
      const name = cityName ?? place?.name;
      const country = place?.country;

      setWeather({
        ...data,
        location: {
          ...data.location,
          ...(name && { name }),
          ...(country && { country }),
        },
      });
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Failed to load weather data.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const handleSelectCity = (city) => {
    setSearchResults([]);
    setLocationError(null);
    loadWeather(city.latitude, city.longitude, city.name);
  };

  const handleSearch = useCallback(async (city) => {
    if (!city) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await searchCity(city);
      setSearchResults(response.data.results ?? []);
    } catch (err) {
      console.error("City search error:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported. Search for a city to continue."
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationLoading(false);
        await loadWeather(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError(getLocationErrorMessage(err));
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [loadWeather]);

  if (locationLoading) {
    return <div>Detecting your location...</div>;
  }

  return (
    <>
      <SkyBackground condition={condition} night={night} />

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
        activeView={activeView}
        onNavigate={setActiveView}
      />

      <div
        className={`app-shell ${sidebarOpen ? "app-shell--sidebar-open" : ""}`}
      >
        <Navbar
          onSearch={handleSearch}
          searchResults={searchResults}
          searchLoading={searchLoading}
          onSelectCity={handleSelectCity}
          locationName={weather?.location?.name}
          locationError={locationError}
        />

        <main>
          {activeView === "favorites" ? (
    <Favorites
      onSelectCity={(city) => {
        setActiveView("today");
        loadWeather(city.latitude, city.longitude, city.name);
      }}
    />
  ) 
          : weather ? (
            <>
              <WeatherHero
                weather={weather}
                condition={condition}
                night={night}
              />
              <HourlyForecast weather={weather} />
              <DailyForecast weather={weather} />
              <WeatherDetails weather={weather} />
            </>
          ) : weatherLoading ? (
            <div>Loading weather...</div>
          ) : (
            <div>{error ?? locationError}</div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;