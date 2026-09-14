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
        except (ValueError, TypeError):
            return Response({"error": "latitude and longitude must be valid numbers."}, status=status.HTTP_401_UNAUTHORIZED)

        if not -90 <= latitude <= 90:
            return Response({"error": "latitude must be between -90 and 90."}, status=status.HTTP_400_BAD_REQUEST)

        if not -180 <= longitude <= 180:
            return Response({"error": "longitude must be between -180 and 180."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            weather=WeatherService.get_weather(latitude=latitude, longitude=longitude)

        except RuntimeError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


        return Response(weather)

class CitySearchAPIView(APIView):
    def get(self, request):
        name=request.query_params.get("name", "").strip()

        if not name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            results=GeocodingService.search_city(name)
        except RuntimeError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({"results": results})