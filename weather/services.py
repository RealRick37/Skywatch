import httpx


class WeatherService:
    BASE_URL="https://api.open-meteo.com/v1/forecast"

    @classmethod
    def get_weather(cls, latitude, longitude):
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": ",".join([
                "temperature_2m",
                "apparent_temperature",
                "relative_humidity_2m",
                "wind_speed_10m",
                "pressure_msl",
                "visibility",
                "uv_index",
                "precipitation",
                "weather_code",
            ]),
            "hourly": ",".join([
                "temperature_2m",
                "apparent_temperature",
                "precipitation_probability",
                "precipitation",
                "wind_speed_10m",
                "weather_code",
            ]),
            "daily": ",".join([
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "precipitation_sum",
                "wind_speed_10m_max",
                "sunrise",
                "sunset",
            ]),
            "timezone": "auto",
            "forecast_days": 7,
        }

        response=httpx.get(cls.BASE_URL, params=params, timeout=10.0)

        response.raise_for_status()

        return response.json()