from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, CustomLoginSerializer, LogOutSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone (even unauthenticated) can register


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer
    permission_classes = [AllowAny]


class LogOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        try:
            old_refresh_token = serializer.validated_data['refresh']
            token = RefreshToken(old_refresh_token)
            token.blacklist()

            return Response({"message":"Log Out Successfully!"}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({"error": "token is invalid or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)
