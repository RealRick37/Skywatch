import './App.css'
import Navbar from "./components/layout/Navbar";
import WeatherHero from "./components/weather/WeatherHero";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherDetails from './components/weather/WeatherDetails';
import SkyBackground from "./components/background/SkyBackground";
import { getWeather } from "./services/weather";

console.log(getWeather);

function App() {
  return (
    <>
      <SkyBackground condition="clear" />

      <Navbar />

      <main>
        <WeatherHero />
        <HourlyForecast />
        <DailyForecast />
        <WeatherDetails />
      </main>
    </>
  );
}


export default App;