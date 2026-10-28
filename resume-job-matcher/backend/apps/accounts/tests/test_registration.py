from django.test import TestCase

from apps.accounts.models import Company, EmployerProfile, JobSeekerProfile
from apps.accounts.serializers import RegisterSerializer


class JobSeekerRegistrationTests(TestCase):
    def test_registration_starts_job_seeker_with_zero_years_experience(self):
        RegisterSerializer().create({
            'email': 'jobseeker@example.com',
            'password': 'test-password-123',
            'role': 'job_seeker',
            'full_name': 'Konain Worsi',
        })

        profile = JobSeekerProfile.objects.get(user__email='jobseeker@example.com')
        self.assertEqual(profile.full_name, 'Konain Worsi')
        self.assertEqual(profile.years_experience, 0)


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
