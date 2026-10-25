from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )
    # We add the role field
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')

    def __str__(self):
        return f"{self.email} ({self.role})"


class Company(models.Model):
    name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=2)
    size = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class JobSeekerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_seeker_profile')
    full_name = models.CharField(max_length=150, blank=True, null=True)
    headline = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=2, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    years_experience = models.SmallIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Seeker Profile"


class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Employer Profile"
