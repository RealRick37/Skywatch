from rest_framework import serializers
from .models import FavoriteLocation

class FavoriteLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model=FavoriteLocation
        fields=[
            "id",
            "name",
            "latitude",
            "longitude",
            "country",
            "country_code",
            "timezone",
            "created_at",
        ]
        read_only_fields=["id", "created_at"]
        extra_kwargs={
            "country": {"required": False, "allow_blank": True},
            "country_code": {"required": False, "allow_blank": True},
            "timezone": {"required": False, "allow_blank": True},
        }

    def validate_latitude(self, value):
        if not -90<=value<=90:
            raise serializers.ValidationError("Latitude must be between -90 and 90.")

        return value

    def validate_longitude(self, value):
        if not -180<=value<=180:
            raise serializers.ValidationError("Longitude must be between -180 and 180.")

        return value

    def validate(self, attrs):
        request=self.context.get("request")

        if request and FavoriteLocation.objects.filter(user=request.user, latitude=attrs["latitude"],
            longitude=attrs["longitude"]).exists():
            raise serializers.ValidationError("This location is already in your favorites.")

        return attrs



class ComparisonLocationSerializer(serializers.Serializer):
    name=serializers.CharField(max_length=100)
    latitude=serializers.FloatField(min_value=-90, max_value=90)
    longitude=serializers.FloatField(min_value=-180, max_value=180)
    country=serializers.CharField(max_length=100, required=False, allow_blank=True)
    country_code=serializers.CharField(max_length=2, required=False, allow_blank=True)
    timezone=serializers.CharField(max_length=100, required=False, allow_blank=True)


class WeatherComparisonSerializer(serializers.Serializer):
    locations=serializers.ListField(child=ComparisonLocationSerializer(), min_length=2, max_length=4)

    def validate(self, attrs):
        locations=attrs["locations"]
        coordinates=[(location["latitude"], location["longitude"]) for location in locations]

        if len(coordinates)!=len(set(coordinates)):
            raise serializers.ValidationError({"locations": "Duplicate locations are not allowed."})

        return attrs
