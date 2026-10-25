from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone (even unauthenticated) can register


class CustomLoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop(User.USERNAME_FIELD, None)

    def validate(self, attrs):
        # Resolve the email to the account username, then authenticate normally.
        try:
            account = User.objects.get(email__iexact=attrs['email'])
        except User.DoesNotExist:
            raise AuthenticationFailed('No active account found with the given credentials')

        user = authenticate(
            request=self.context.get('request'),
            username=account.get_username(),
            password=attrs['password'],
        )
        if user is None:
            raise AuthenticationFailed('No active account found with the given credentials')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role,
        }

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer
