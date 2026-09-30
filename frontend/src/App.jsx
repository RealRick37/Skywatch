import './App.css'
import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import WeatherHero from "./components/weather/WeatherHero";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherDetails from './components/weather/WeatherDetails';
import SkyBackground from "./components/background/SkyBackground";
import { getWeather } from "./services/weather";


function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (city) => {
  console.log("Searching for:", city);
  };

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

      <Navbar onSearch={handleSearch} />

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