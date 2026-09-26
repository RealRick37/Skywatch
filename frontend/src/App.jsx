import './App.css'
import Navbar from "./components/layout/Navbar";
import WeatherHero from "./components/weather/WeatherHero";
import SkyBackground from "./components/background/SkyBackground";

function App() {
  return (
    <>
      <SkyBackground condition="clear" />

      <Navbar />

      <main>
        <WeatherHero />
      </main>
    </>
  );
}


export default App;