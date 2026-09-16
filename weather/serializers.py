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