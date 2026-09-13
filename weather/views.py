from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .services import WeatherService, GeocodingService

# Create your views here.

class WeatherAPIView(APIView):
    def get(self, request):
        latitude=request.query_params.get("latitude")
        longitude=request.query_params.get("longitude")

        if latitude is None or longitude is None:
            return Response({"error": "latitude and longitude are required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            latitude=float(latitude)
            longitude=float(longitude)
        except ValueError:
            return Response({"error": "latitude and longitude must be valid numbers."}, status=status.HTTP_401_UNAUTHORIZED)

        weather=WeatherService.get_weather(latitude=latitude, longitude=longitude)

        return Response(weather)

class CitySearchAPIView(APIView):
    def get(self, request):
        name=request.query_params.get("name")

        if not name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        results=GeocodingService.search_city(name)
        return Response({"results": results})