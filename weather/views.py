from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .services import WeatherService

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