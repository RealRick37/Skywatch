from unittest.mock import Mock, patch

import httpx
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import FavoriteLocation
from .services import WeatherService, GeocodingService

User = get_user_model()


def get_weather_payload():
    return {
        "latitude": 37.27,
        "longitude": 49.58,
        "timezone": "Asia/Tehran",
        "current_units": {
            "temperature_2m": "°C",
            "apparent_temperature": "°C",
            "relative_humidity_2m": "%",
            "wind_speed_10m": "km/h",
            "pressure_msl": "hPa",
            "visibility": "m",
            "precipitation": "mm",
        },
        "current": {
            "time": "2026-11-08T12:00",
            "temperature_2m": 20.5,
            "apparent_temperature": 19.8,
            "relative_humidity_2m": 65,
            "wind_speed_10m": 12.0,
            "pressure_msl": 1013.2,
            "visibility": 10000,
            "uv_index": 3.5,
            "precipitation": 0.0,
            "weather_code": 1,
        },
        "hourly": {
            "time": ["2026-11-08T12:00", "2026-11-08T13:00"],
            "temperature_2m": [20.5, 21.0],
            "apparent_temperature": [19.8, 20.3],
            "precipitation_probability": [0, 10],
            "precipitation": [0.0, 0.1],
            "wind_speed_10m": [12.0, 13.0],
            "weather_code": [1, 2],
        },
        "daily": {
            "time": ["2026-11-08", "2026-11-09"],
            "temperature_2m_max": [23.0, 24.0],
            "temperature_2m_min": [15.0, 16.0],
            "precipitation_probability_max": [10, 20],
            "precipitation_sum": [0.0, 1.2],
            "wind_speed_10m_max": [18.0, 20.0],
            "weather_code": [1, 61],
            "sunrise": ["2026-11-08T06:30", "2026-11-09T06:31"],
            "sunset": ["2026-11-08T17:00", "2026-11-09T16:59"],
        },
    }


def get_city_results():
    return [
        {
            "id": 123,
            "name": "Rasht",
            "latitude": 37.27,
            "longitude": 49.58,
            "country": "Iran",
            "country_code": "IR",
            "admin1": "Gilan",
            "timezone": "Asia/Tehran",
            "population": 679995,
        }
    ]


class WeatherServiceTests(APITestCase):
    @patch("weather.services.httpx.get")
    def test_get_weather_successfully(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = get_weather_payload()
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result = WeatherService.get_weather(37.27, 49.58)

        self.assertEqual(result["location"]["latitude"], 37.27)
        self.assertEqual(result["location"]["timezone"], "Asia/Tehran")
        self.assertEqual(result["current"]["temperature"], 20.5)
        self.assertEqual(result["current"]["condition"], "Mainly clear")
        self.assertEqual(len(result["hourly"]), 2)
        self.assertEqual(len(result["daily"]), 2)

    @patch("weather.services.httpx.get")
    def test_get_weather_sends_correct_parameters(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = get_weather_payload()
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        WeatherService.get_weather(37.27, 49.58)

        _, kwargs = mock_get.call_args
        self.assertEqual(kwargs["params"]["latitude"], 37.27)
        self.assertEqual(kwargs["params"]["longitude"], 49.58)
        self.assertEqual(kwargs["params"]["timezone"], "auto")
        self.assertEqual(kwargs["params"]["forecast_days"], 7)
        self.assertEqual(kwargs["timeout"], 10.0)

    @patch("weather.services.httpx.get")
    def test_get_weather_handles_request_error(self, mock_get):
        mock_get.side_effect = httpx.ConnectError("Connection failed")

        with self.assertRaisesMessage(
            RuntimeError, "Weather service is unavailable."
        ):
            WeatherService.get_weather(37.27, 49.58)

    @patch("weather.services.httpx.get")
    def test_get_weather_handles_http_error(self, mock_get):
        request = httpx.Request("GET", WeatherService.BASE_URL)
        response = httpx.Response(500, request=request)

        mock_response = Mock()
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Server error",
            request=request,
            response=response,
        )
        mock_get.return_value = mock_response

        with self.assertRaisesMessage(
            RuntimeError, "Weather service returned an error."
        ):
            WeatherService.get_weather(37.27, 49.58)

    def test_get_weather_condition(self):
        self.assertEqual(
            WeatherService.get_weather_condition(0), "Clear sky"
        )
        self.assertEqual(
            WeatherService.get_weather_condition(61), "Slight rain"
        )
        self.assertEqual(
            WeatherService.get_weather_condition(95), "Thunderstorm"
        )
        self.assertEqual(
            WeatherService.get_weather_condition(999), "Unknown"
        )


class GeocodingServiceTests(APITestCase):
    @patch("weather.services.httpx.get")
    def test_search_city_successfully(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {
            "results": get_city_results()
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = GeocodingService.search_city("Rasht")

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Rasht")
        self.assertEqual(results[0]["country"], "Iran")
        self.assertEqual(results[0]["latitude"], 37.27)

    @patch("weather.services.httpx.get")
    def test_search_city_returns_empty_list(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = GeocodingService.search_city("Unknown")

        self.assertEqual(results, [])

    @patch("weather.services.httpx.get")
    def test_search_city_handles_request_error(self, mock_get):
        mock_get.side_effect = httpx.ConnectError("Connection failed")

        with self.assertRaisesMessage(
            RuntimeError, "Geocoding service is unavailable."
        ):
            GeocodingService.search_city("Rasht")

    @patch("weather.services.httpx.get")
    def test_search_city_handles_http_error(self, mock_get):
        request = httpx.Request("GET", GeocodingService.BASE_URL)
        response = httpx.Response(500, request=request)

        mock_response = Mock()
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Server error",
            request=request,
            response=response,
        )
        mock_get.return_value = mock_response

        with self.assertRaisesMessage(
            RuntimeError, "Geocoding service returned an error."
        ):
            GeocodingService.search_city("Rasht")


class WeatherAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("weather")

    @patch("weather.views.WeatherService.get_weather")
    def test_get_weather_successfully(self, mock_weather):
        mock_weather.return_value = {"current": {"temperature": 20.5}}

        response = self.client.get(
            self.url,
            {"latitude": 37.27, "longitude": 49.58},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["current"]["temperature"], 20.5
        )
        mock_weather.assert_called_once_with(
            latitude=37.27,
            longitude=49.58,
        )

    def test_get_weather_without_coordinates(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_get_weather_with_invalid_coordinates(self):
        response = self.client.get(
            self.url,
            {"latitude": "abc", "longitude": "49.58"},
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_get_weather_with_out_of_range_latitude(self):
        response = self.client.get(
            self.url,
            {"latitude": 91, "longitude": 49.58},
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_get_weather_with_out_of_range_longitude(self):
        response = self.client.get(
            self.url,
            {"latitude": 37.27, "longitude": 181},
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    @patch("weather.views.WeatherService.get_weather")
    def test_get_weather_when_service_is_unavailable(self, mock_weather):
        mock_weather.side_effect = RuntimeError(
            "Weather service is unavailable."
        )

        response = self.client.get(
            self.url,
            {"latitude": 37.27, "longitude": 49.58},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class CitySearchAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("city-search")

    @patch("weather.views.GeocodingService.search_city")
    def test_search_city_successfully(self, mock_search):
        mock_search.return_value = get_city_results()

        response = self.client.get(self.url, {"name": "Rasht"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "Rasht")

    def test_search_city_without_name(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_search_city_with_blank_name(self):
        response = self.client.get(self.url, {"name": "   "})

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    @patch("weather.views.GeocodingService.search_city")
    def test_search_city_when_service_is_unavailable(self, mock_search):
        mock_search.side_effect = RuntimeError(
            "Geocoding service is unavailable."
        )

        response = self.client.get(self.url, {"name": "Rasht"})

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class CityWeatherAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("city-weather")

    @patch("weather.views.WeatherService.get_weather")
    @patch("weather.views.GeocodingService.search_city")
    def test_get_city_weather_successfully(
        self, mock_search, mock_weather
    ):
        mock_search.return_value = get_city_results()
        mock_weather.return_value = {
            "location": {
                "latitude": 37.27,
                "longitude": 49.58,
                "timezone": "Asia/Tehran",
            },
            "current": {"temperature": 20.5},
        }

        response = self.client.get(self.url, {"name": "Rasht"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["location"]["name"], "Rasht")
        self.assertEqual(response.data["location"]["country"], "Iran")
        self.assertEqual(
            response.data["current"]["temperature"], 20.5
        )

    def test_get_city_weather_without_name(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    @patch("weather.views.GeocodingService.search_city")
    def test_get_city_weather_when_city_not_found(self, mock_search):
        mock_search.return_value = []

        response = self.client.get(self.url, {"name": "Unknown"})

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )

    @patch("weather.views.GeocodingService.search_city")
    def test_get_city_weather_when_geocoding_fails(self, mock_search):
        mock_search.side_effect = RuntimeError(
            "Geocoding service is unavailable."
        )

        response = self.client.get(self.url, {"name": "Rasht"})

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    @patch("weather.views.WeatherService.get_weather")
    @patch("weather.views.GeocodingService.search_city")
    def test_get_city_weather_when_weather_service_fails(
        self, mock_search, mock_weather
    ):
        mock_search.return_value = get_city_results()
        mock_weather.side_effect = RuntimeError(
            "Weather service is unavailable."
        )

        response = self.client.get(self.url, {"name": "Rasht"})

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class FavoriteLocationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="strongpass123",
        )
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="strongpass123",
        )

        self.client.force_authenticate(user=self.user)

        self.list_url = reverse("favorite-list-create")

        self.valid_data = {
            "name": "Rasht",
            "latitude": 37.27,
            "longitude": 49.58,
            "country": "Iran",
            "country_code": "IR",
            "timezone": "Asia/Tehran",
        }

    def test_list_favorites(self):
        FavoriteLocation.objects.create(
            user=self.user, **self.valid_data
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Rasht")

    def test_list_favorites_only_for_authenticated_user(self):
        FavoriteLocation.objects.create(
            user=self.other_user,
            **{
                **self.valid_data,
                "name": "Tehran",
            },
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_favorite_successfully(self):
        response = self.client.post(
            self.list_url, self.valid_data, format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED
        )
        self.assertEqual(response.data["name"], "Rasht")
        self.assertTrue(
            FavoriteLocation.objects.filter(
                user=self.user,
                latitude=37.27,
                longitude=49.58,
            ).exists()
        )

    def test_create_duplicate_favorite(self):
        FavoriteLocation.objects.create(
            user=self.user, **self.valid_data
        )

        response = self.client.post(
            self.list_url, self.valid_data, format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_create_favorite_with_invalid_latitude(self):
        data = {**self.valid_data, "latitude": 91}

        response = self.client.post(
            self.list_url, data, format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )
        self.assertIn("latitude", response.data)

    def test_create_favorite_with_invalid_longitude(self):
        data = {**self.valid_data, "longitude": 181}

        response = self.client.post(
            self.list_url, data, format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )
        self.assertIn("longitude", response.data)

    def test_favorites_require_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_retrieve_favorite(self):
        favorite = FavoriteLocation.objects.create(
            user=self.user, **self.valid_data
        )
        url = reverse("favorite-detail", kwargs={"pk": favorite.pk})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], favorite.id)

    def test_user_cannot_retrieve_another_users_favorite(self):
        favorite = FavoriteLocation.objects.create(
            user=self.other_user, **self.valid_data
        )
        url = reverse("favorite-detail", kwargs={"pk": favorite.pk})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_favorite(self):
        favorite = FavoriteLocation.objects.create(
            user=self.user, **self.valid_data
        )
        url = reverse("favorite-detail", kwargs={"pk": favorite.pk})

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code, status.HTTP_204_NO_CONTENT
        )
        self.assertFalse(
            FavoriteLocation.objects.filter(pk=favorite.pk).exists()
        )

    def test_user_cannot_delete_another_users_favorite(self):
        favorite = FavoriteLocation.objects.create(
            user=self.other_user, **self.valid_data
        )
        url = reverse("favorite-detail", kwargs={"pk": favorite.pk})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            FavoriteLocation.objects.filter(pk=favorite.pk).exists()
        )

    def test_retrieve_nonexistent_favorite(self):
        url = reverse("favorite-detail", kwargs={"pk": 99999})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent_favorite(self):
        url = reverse("favorite-detail", kwargs={"pk": 99999})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class FavoriteLocationsWeatherAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="strongpass123",
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse("favorite-locations-weather")

    @patch("weather.views.WeatherService.get_weather")
    def test_get_favorites_weather(self, mock_weather):
        FavoriteLocation.objects.create(
            user=self.user,
            name="Rasht",
            latitude=37.27,
            longitude=49.58,
            country="Iran",
            country_code="IR",
            timezone="Asia/Tehran",
        )
        mock_weather.return_value = {
            "current": {"temperature": 20.5},
            "units": {"temperature": "°C"},
        }

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "Rasht")
        self.assertEqual(
            response.data["results"][0]["weather"]["temperature"], 20.5
        )

    @patch("weather.views.WeatherService.get_weather")
    def test_get_favorites_weather_handles_service_error(
        self, mock_weather
    ):
        FavoriteLocation.objects.create(
            user=self.user,
            name="Rasht",
            latitude=37.27,
            longitude=49.58,
            country="Iran",
            country_code="IR",
            timezone="Asia/Tehran",
        )
        mock_weather.side_effect = RuntimeError(
            "Weather service is unavailable."
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("error", response.data["results"][0])

    def test_favorites_weather_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED
        )
