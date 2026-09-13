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

    @classmethod
    def _normalize_response(cls, data):
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
                "condition": cls.get_weather_condition(hourly_data["weather_code"][i]),
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
                "condition": cls.get_weather_condition(daily_data["weather_code"][i]),
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
                "condition": cls.get_weather_condition(data["current"]["weather_code"]),
            },
            "hourly": hourly,
            "daily": daily,
        }


    @staticmethod
    def get_weather_condition(weather_code):
        conditions={
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            56: "Light freezing drizzle",
            57: "Dense freezing drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            66: "Light freezing rain",
            67: "Heavy freezing rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail",
        }

        return conditions.get(weather_code, "Unknown")



class GeocodingService:
    BASE_URL="https://geocoding-api.open-meteo.com/v1/search"

    @classmethod
    def search_city(cls, name):
        params={
            "name": name,
            "count": 5,
            "language": "en",
            "format": "json",
        }

        response=httpx.get(cls.BASE_URL, params=params, timeout=10.0)
        response.raise_for_status()
        data=response.json()

        return data.get("results", [])

    @staticmethod
    def _normalize_results(results):
        return [
            {
                "id": result["id"],
                "name": result["name"],
                "latitude": result["latitude"],
                "longitude": result["longitude"],
                "country": result["country"],
                "country_code": result["country_code"],
                "admin1": result.get("admin1"),
                "timezone": result["timezone"],
                "population": result.get("population"),
            }
            for result in results
        ]