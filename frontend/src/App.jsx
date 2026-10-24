import './App.css'
import { useCallback, useEffect, useState, useRef } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import WeatherHero from "./components/weather/WeatherHero";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherDetails from './components/weather/WeatherDetails';
import SkyBackground from "./components/background/SkyBackground";
import Favorites from "./components/favorites/Favorites";
import { getWeather, searchCity, reverseGeocode, getFavoriteWeather, addFavorite } from "./services/weather";
import { getWeatherCondition, isNight } from "./utils/weather";
import AuthPage from "./components/auth/AuthPage";
import { getCurrentUser } from "./services/auth";
import DevSkySwitcher from "./components/dev/DevSkySwitcher";
import MapPicker from "./components/map/MapPicker";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/errors/NotFound";
import WeatherState from "./components/common/WeatherState";

const COORD_TOLERANCE = 0.01;

function isSameLocation(a, b) {
  return (
    Math.abs(Number(a.latitude) - Number(b.latitude)) < COORD_TOLERANCE &&
    Math.abs(Number(a.longitude) - Number(b.longitude)) < COORD_TOLERANCE
  );
}

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

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);

  const [lastWeatherRequest, setLastWeatherRequest] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCurrentLocation, setIsCurrentLocation] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [skyOverride, setSkyOverride] = useState(null);
  const [nightOverride, setNightOverride] = useState(null);

  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState(null);

  const [activeView, setActiveView] = useState("today");

  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const condition = skyOverride ?? getWeatherCondition(weather);
  const night = nightOverride ?? isNight(weather);

  const handleAuthenticated = async () => {
    const response = await getCurrentUser();
    setUser(response.data);
    setShowAuth(false);
    setActiveView("today");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setShowAuth(false);
    setActiveView("today");
  };

  useEffect(() => {
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteLocations([]);
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      try {
        const response = await getFavoriteWeather();

        if (!cancelled) {
          setFavoriteLocations(response.data.results ?? []);
        }
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleAddFavorite = async () => {
    if (!user || !weather || favoriteLoading) return;

    const location = weather.location;

    const alreadyFavorite = favoriteLocations.some((favorite) =>
      isSameLocation(favorite, location)
    );

    if (alreadyFavorite) return;

    setFavoriteLoading(true);
    setFavoriteError(null);

    try {
      const response = await addFavorite({
        name: location.name || location.timezone,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country || "",
        country_code: location.country_code || "",
        timezone: location.timezone || "",
      });

      setFavoriteLocations((previous) => [...previous, response.data]);
    } catch (err) {
      const data = err.response?.data;
      console.error("Failed to add favorite:", data);

      const firstFieldError =
        data && typeof data === "object"
          ? Object.values(data).flat()[0]
          : null;

      setFavoriteError(
        data?.detail ||
          firstFieldError ||
          "Could not add this city to favorites. Please try again."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleFavoriteRemoved = useCallback((id) => {
    setFavoriteLocations((previous) =>
      previous.filter((favorite) => favorite.id !== id)
    );
  }, []);

  const handleNavigate = (view) => {
    if (view === "favorites" && !user) {
      setShowAuth(true);
      return;
    }

    setShowAuth(false);
    setActiveView(view);
    setSidebarOpen(false);
  };

  const loadWeather = useCallback(async (latitude, longitude, city) => {
    setLastWeatherRequest({ latitude, longitude, city });
    setWeatherLoading(true);
    setError(null);
    setFavoriteError(null);

    try {
      const [response, place] = await Promise.all([
        getWeather(latitude, longitude),
        city?.name
          ? Promise.resolve(null)
          : reverseGeocode(latitude, longitude).catch(() => null),
      ]);

      const data = response.data;
      const name = city?.name ?? place?.name;
      const country = city?.country ?? place?.country;
      const countryCode = city?.country_code ?? place?.countryCode;

      setWeather({
        ...data,
        location: {
          ...data.location,
          latitude: Number(latitude),
          longitude: Number(longitude),
          ...(name && { name }),
          ...(country && { country }),
          ...(countryCode && { country_code: countryCode }),
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
    setIsCurrentLocation(false);
    setActiveView("today");
    loadWeather(city.latitude, city.longitude, city);
  };

  const handleReturnToCurrentLocation = () => {
    if (!currentLocation) {
      setLocationError("Current location is not available yet.");
      return;
    }

    setIsCurrentLocation(true);
    setLocationError(null);
    setActiveView("today");

    loadWeather(currentLocation.latitude, currentLocation.longitude);
  };

  
  const searchRequestId = useRef(0);

  const handleSearch = useCallback(async (city) => {
    const requestId = ++searchRequestId.current;
    const query = city.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await searchCity(query);

      if (requestId !== searchRequestId.current) return;

      setSearchResults(response.data.results ?? []);
    } catch (err) {
      if (requestId !== searchRequestId.current) return;

      console.error("City search error:", err);
      setSearchResults([]);
    } finally {
      if (requestId === searchRequestId.current) {
        setSearchLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) return;

    getCurrentUser()
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Session restore failed:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      });
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
        setCurrentLocation({ latitude, longitude });
        setIsCurrentLocation(true);
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



  const isFavorite = weather
    ? favoriteLocations.some((favorite) =>
        isSameLocation(favorite, weather.location)
      )
    : false;

  return (
    <>
      <SkyBackground condition={condition} night={night} />

      {import.meta.env.DEV && (
        <DevSkySwitcher
          sky={skyOverride}
          night={nightOverride}
          onSky={setSkyOverride}
          onNight={setNightOverride}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
        activeView={showAuth ? "" : activeView}
        onNavigate={handleNavigate}
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
          onReturnToCurrentLocation={handleReturnToCurrentLocation}
          isCurrentLocation={isCurrentLocation}
          hasCurrentLocation={Boolean(currentLocation)}
          locationError={locationError}
          user={user}
          onAuthClick={() => setShowAuth(true)}
          onLogout={handleLogout}
        />

        <main>
          {showAuth ? (
            <AuthPage
              onAuthenticated={handleAuthenticated}
              onBack={() => setShowAuth(false)}
            />
          ) : activeView === "favorites" ? (
            <Favorites
              onFavoriteRemoved={handleFavoriteRemoved}
              onSelectCity={(city) => {
                setIsCurrentLocation(false);
                setLocationError(null);
                setActiveView("today");
                loadWeather(city.latitude, city.longitude, city);
              }}
            />
          ) : activeView === "map" ? (
            <MapPicker
              initialPosition={
                currentLocation
                  ? [currentLocation.latitude, currentLocation.longitude]
                  : [40.4093, 49.8671]
              }
              onSelectLocation={({ latitude, longitude }) => {
                setIsCurrentLocation(false);
                setLocationError(null);
                setActiveView("today");
                loadWeather(latitude, longitude);
              }}
            />
          ) : locationLoading ? (
            <WeatherState
              type="loading"
              title="Finding your location..."
              message="Getting your local weather ready."
            />
          ) : weatherLoading ? (
            <WeatherState type="loading" />
          ) : error ? (
            <WeatherState
              type="error"
              message={error}
              onRetry={
                lastWeatherRequest
                  ? () =>
                      loadWeather(
                        lastWeatherRequest.latitude,
                        lastWeatherRequest.longitude,
                        lastWeatherRequest.city
                      )
                  : undefined
              }
            />
          ) : weather ? (
            <>
              <WeatherHero
                weather={weather}
                condition={condition}
                night={night}
                user={user}
                isFavorite={isFavorite}
                favoriteLoading={favoriteLoading}
                favoriteError={favoriteError}
                onAddFavorite={handleAddFavorite}
                onAuthClick={() => setShowAuth(true)}
              />
              <HourlyForecast weather={weather} />
              <DailyForecast weather={weather} />
              <WeatherDetails weather={weather} />
            </>
          ) : locationError ? (
            <WeatherState
              type="error"
              title="Location unavailable"
              message={locationError}
            />
          ) : null}
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<WeatherApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;