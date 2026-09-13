from django.urls import path
from .views import WeatherAPIView, CitySearchAPIView

urlpatterns = [
    path("", WeatherAPIView.as_view(), name="weather"),
    path("search/", CitySearchAPIView.as_view(), name="city-search"),
]