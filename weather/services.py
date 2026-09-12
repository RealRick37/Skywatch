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
        data=response.json()
        return cls._normalize_response(data)

    @staticmethod
    def _normalize_response(data):
        hourly_data=data["hourly"]
        daily_data=data["daily"]

        hourly=[
            {
                "time": hourly_data["time"][i],
                "temperature": hourly_data["temperature_2m"][i],
                "feels_like": hourly_data["apparent_temperature"][i],
                "precipitation_probability": hourly_data["precipitation_probability"][i],
                "precipitation": hourly_data["precipitation"][i],
                "wind_speed": hourly_data["wind_speed_10m"][i],
                "weather_code": hourly_data["weather_code"][i],
            }
            for i in range(len(hourly_data["time"]))
        ]

        daily=[
            {
                "date": daily_data["time"][i],
                "temperature_max": daily_data["temperature_2m_max"][i],
                "temperature_min": daily_data["temperature_2m_min"][i],
                "precipitation_probability": daily_data["precipitation_probability_max"][i],
                "precipitation": daily_data["precipitation_sum"][i],
                "wind_speed_max": daily_data["wind_speed_10m_max"][i],
                "weather_code": daily_data["weather_code"][i],
                "sunrise": daily_data["sunrise"][i],
                "sunset": daily_data["sunset"][i],
            }
            for i in range(len(daily_data["time"]))
        ]

        return {
            "location": {
                "latitude": data["latitude"],
                "longitude": data["longitude"],
                "timezone": data["timezone"],
            },
            "current": {
                "time": data["current"]["time"],
                "temperature": data["current"]["temperature_2m"],
                "feels_like": data["current"]["apparent_temperature"],
                "humidity": data["current"]["relative_humidity_2m"],
                "wind_speed": data["current"]["wind_speed_10m"],
                "pressure": data["current"]["pressure_msl"],
                "visibility": data["current"]["visibility"],
                "uv_index": data["current"]["uv_index"],
                "precipitation": data["current"]["precipitation"],
                "weather_code": data["current"]["weather_code"],
            },
            "hourly": hourly,
            "daily": daily,
        }