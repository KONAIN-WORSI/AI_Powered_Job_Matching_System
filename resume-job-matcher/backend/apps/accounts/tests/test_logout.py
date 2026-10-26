from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutViewTests(TestCase):
    def test_logout_blacklists_submitted_refresh_token(self):
        user = get_user_model().objects.create_user(
            email='logout@example.com',
            password='test-password-123',
        )
        refresh = RefreshToken.for_user(user)
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            reverse('logout'),
            {'refresh': str(refresh)},
            format='json',
        )

        self.assertEqual(response.status_code, 205)
        with self.assertRaises(TokenError):
            RefreshToken(str(refresh)).check_blacklist()
