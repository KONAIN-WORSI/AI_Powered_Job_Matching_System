from django.urls import path
from .views import RegisterView, CustomLoginView, LogOutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login (Takes username & password, returns JWT access & refresh tokens)
    path('login/', CustomLoginView.as_view(), name='login'),
    
    # Refresh (Takes a refresh token, returns a new access token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Logout path to remove the refresh token from the browser local storage
    path('logout/', LogOutView.as_view(), name='logout'),
]