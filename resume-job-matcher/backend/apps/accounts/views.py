from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, CustomLoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone (even unauthenticated) can register


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer
    permission_classes = [AllowAny]
