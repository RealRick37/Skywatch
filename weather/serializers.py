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