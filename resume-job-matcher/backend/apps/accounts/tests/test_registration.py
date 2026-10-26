from django.test import TestCase

from apps.accounts.models import Company, EmployerProfile
from apps.accounts.serializers import RegisterSerializer


class EmployerRegistrationTests(TestCase):
    def test_registration_links_employer_to_company(self):
        RegisterSerializer().create({
            'email': 'employer@example.com',
            'password': 'test-password-123',
            'role': 'employer',
            'company': 'Acme',
            'job_title': 'Recruiter',
        })

        profile = EmployerProfile.objects.get(user__email='employer@example.com')
        self.assertEqual(profile.company.name, 'Acme')

    def test_registration_allows_employer_without_company(self):
        RegisterSerializer().create({
            'email': 'employer@example.com',
            'password': 'test-password-123',
            'role': 'employer',
        })

        profile = EmployerProfile.objects.get(user__email='employer@example.com')
        self.assertIsNone(profile.company)
        self.assertEqual(Company.objects.count(), 0)
