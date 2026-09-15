from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer

# Create your views here.

class RegisterAPIView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        serializer=RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()

        return Response({"message": "User registered successfully.", "user": {"id": user.id, "username": user.username,
                        "email": user.email}}, status=status.HTTP_201_CREATED)


class MeAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        return Response({"id": request.user.id, "username": request.user.username,"email": request.user.email})