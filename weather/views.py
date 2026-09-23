from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import WeatherService, GeocodingService
from .serializers import FavoriteLocationSerializer
from .models import FavoriteLocation
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Create your views here.

class WeatherAPIView(APIView):
    @extend_schema(summary="Get weather by coordinates", description="Returns current weather, hourly forecast, and 7-day forecast for the given coordinates.", parameters=[OpenApiParameter(name="latitude", type=float, required=True, description="Latitude between -90 and 90."), OpenApiParameter(name="longitude", type=float, required=True,description="Longitude between -180 and 180.")])

    def get(self, request):
        latitude=request.query_params.get("latitude")
        longitude=request.query_params.get("longitude")

        if latitude is None or longitude is None:
            return Response({"error": "latitude and longitude are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            latitude=float(latitude)
            longitude=float(longitude)
        except (ValueError, TypeError):
            return Response({"error": "latitude and longitude must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)

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
    @extend_schema(summary="Search for cities", description="Searches for cities by name.", 
    parameters=[OpenApiParameter(name="name", type=str, required=True, description="City name to search for.")])

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
    @extend_schema(summary="Get weather for a city", description="Returns weather information for the first matching city.",parameters=[OpenApiParameter(name="name", type=str, required=True, description="City name.")])

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

    @extend_schema(summary="List favorite locations",description="Returns all favorite locations belonging to the authenticated user.", responses=FavoriteLocationSerializer(many=True))

    def get(self, request):
        favorites=FavoriteLocation.objects.filter(user=request.user).order_by("-created_at")
        serializer=FavoriteLocationSerializer(favorites, many=True)

        return Response(serializer.data)

    @extend_schema(summary="Add a favorite location", description="Adds a new location to the authenticated user's favorites.",
        request=FavoriteLocationSerializer, responses={201: FavoriteLocationSerializer})

    def post(self, request):
        serializer=FavoriteLocationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FavoriteLocationDetailAPIView(APIView):
    permission_classes=[IsAuthenticated]

    @extend_schema(summary="Get a favorite location", description="Returns a specific favorite location belonging to the authenticated user.", parameters=[OpenApiParameter(name="pk", type=int, location=OpenApiParameter.PATH, required=True,
            description="ID of the favorite location.")], responses={200: FavoriteLocationSerializer,
            404: {"description": "Favorite location not found."}})

    def get(self, request, pk):
        try:
            favorite=FavoriteLocation.objects.get(pk=pk, user=request.user)
        except FavoriteLocation.DoesNotExist:
            return Response({"error": "Favorite location not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer=FavoriteLocationSerializer(favorite)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="Delete a favorite location", description="Deletes a specific favorite location belonging to the authenticated user.", parameters=[OpenApiParameter(name="pk", type=int, location=OpenApiParameter.PATH, required=True,
                description="ID of the favorite location.")],
        responses={204: None, 404: {"description": "Favorite location not found."}})

    def delete(self, request, pk):
        try:
            favorite=FavoriteLocation.objects.get(pk=pk, user=request.user)
        except FavoriteLocation.DoesNotExist:
            return Response({"error": "Favorite location not found."}, status=status.HTTP_404_NOT_FOUND)

        favorite.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class FavoriteLocationsWeatherAPIView(APIView):
    permission_classes=[IsAuthenticated]

    @extend_schema(summary="Get weather for favorite locations", description="Returns current weather for all favorite locations belonging to the authenticated user.",
        responses={200: {"type": "object", "properties": {"results": {"type": "array", "items": {"type": "object"}}}}})


    def get(self, request):
        favorites=FavoriteLocation.objects.filter(user=request.user).order_by("-created_at")

        results=[]

        for favorite in favorites:
            try:
                weather=WeatherService.get_weather(latitude=favorite.latitude, longitude=favorite.longitude)
                results.append({
                                "id": favorite.id,
                                "name": favorite.name,
                                "country": favorite.country,
                                "latitude": favorite.latitude,
                                "longitude": favorite.longitude,
                                "weather": weather["current"],
                                "units": weather["units"],
                            })
            
            except RuntimeError as exc:
                results.append({
                "id": favorite.id,
                "name": favorite.name,
                "country": favorite.country,
                "latitude": favorite.latitude,
                "longitude": favorite.longitude,
                "error": str(exc),
            })

        return Response({"results": results})