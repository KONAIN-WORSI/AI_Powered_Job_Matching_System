from django.test import TestCase

from apps.accounts.models import User


class UserModelTests(TestCase):
    def test_user_can_have_job_seeker_role(self):
        user = User.objects.create_user(
            username='candidate',
            password='test-password-123',
            role=User.Role.JOB_SEEKER,
        )

        self.assertEqual(user.role, User.Role.JOB_SEEKER)
