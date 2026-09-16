from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import WeatherService, GeocodingService
from .serializers import FavoriteLocationSerializer
from .models import FavoriteLocation

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

class CityWeatherAPIView(APIView):
    def get(self, request):
        name=request.query_params.get("name", "").strip()

        if not name:
            return Response({"error": "City name is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cities=GeocodingService.search_city(name)
        except RuntimeError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not cities:
            return Response({"error": "City not found."}, status=status.HTTP_404_NOT_FOUND)

        city=cities[0]

        try:
            weather=WeatherService.get_weather(latitude=city["latitude"], longitude=city["longitude"])
        except RuntimeError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        weather["location"]["name"]=city["name"]
        weather["location"]["country"]=city["country"]
        weather["location"]["country_code"]=city["country_code"]

        return Response(weather)


class FavoriteLocationAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        favorites=FavoriteLocation.objects.filter(user=request.user).order_by("-created_at")
        serializer=FavoriteLocationSerializer(favorites, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer=FavoriteLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FavoriteLocationDetailAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, pk):
        try:
            favorite=FavoriteLocation.objects.get(pk=pk, user=request.user)
        except FavoriteLocation.DoesNotExist:
            return Response({"error": "Favorite location not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer=FavoriteLocationSerializer(favorite)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            favorite=FavoriteLocation.objects.get(pk=pk, user=request.user)
        except FavoriteLocation.DoesNotExist:
            return Response({"error": "Favorite location not found."}, status=status.HTTP_404_NOT_FOUND)

        favorite.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)