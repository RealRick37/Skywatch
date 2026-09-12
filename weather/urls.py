from django.urls import path
from .views import WeatherAPIView

urlpatterns = [
    path("", WeatherAPIView.as_view(), name="weather"),
]