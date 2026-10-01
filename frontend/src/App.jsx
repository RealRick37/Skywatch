import './App.css'
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import WeatherHero from "./components/weather/WeatherHero";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherDetails from './components/weather/WeatherDetails';
import SkyBackground from "./components/background/SkyBackground";
import { getWeather, searchCity } from "./services/weather";


function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSelectCity = async (city) => {
    setSearchResults([]);
    setLoading(true);
    setError(null);

    try {
      const response = await getWeather(
        city.latitude,
        city.longitude
      );

      setWeather({
        ...response.data,
        location: {
          ...response.data.location,
          name: city.name,
        },
      });
    } catch (error) {
      console.error("Weather API error:", error);
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (city) => {
    if (!city) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await searchCity(city);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("City search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

   useEffect(() => {
    getWeather(35.6892, 51.3890)
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
      })
      .catch((error) => {
        console.error("Weather API error:", error);
        setError("Failed to load weather data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
      <SkyBackground condition="clear" />

      <Navbar onSearch={handleSearch} searchResults={searchResults} searchLoading={searchLoading} 
      onSelectCity={handleSelectCity} />

      <main>
        <WeatherHero weather={weather} />
        <HourlyForecast weather={weather} />
        <DailyForecast weather={weather} />
        <WeatherDetails weather={weather} />
      </main>
    </>
  );
}


export default App;