from django.db import models
from django.conf import settings

# Create your models here.

class FavoriteLocation(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorite_locations")
    name=models.CharField(max_length=100)
    latitude=models.FloatField()
    longitude=models.FloatField()
    country=models.CharField(max_length=100)
    country_code=models.CharField(max_length=2)
    timezone=models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints=[models.UniqueConstraint(fields=["user", "latitude", "longitude"], name="unique_user_favorite_location")]

    def __str__(self):
        return f"{self.name} - {self.user.username}"