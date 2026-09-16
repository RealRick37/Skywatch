from django.urls import path
from .views import WeatherAPIView, CitySearchAPIView, FavoriteLocationAPIView, FavoriteLocationDetailAPIView

urlpatterns = [
    path("", WeatherAPIView.as_view(), name="weather"),
    path("search/", CitySearchAPIView.as_view(), name="city-search"),
    path("favorites/", FavoriteLocationAPIView.as_view(),name="favorite-list-create"),
    path("favorites/<int:pk>/", FavoriteLocationDetailAPIView.as_view(),name="favorite-detail"),
]