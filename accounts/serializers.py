from django.contrib.auth import get_user_model
from rest_framework import serializers

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(required=True, allow_blank=False)  
    password=serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model=User
        fields=["username", "email", "password"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )