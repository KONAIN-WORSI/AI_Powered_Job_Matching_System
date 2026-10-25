from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email address must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None

    email = models.EmailField(unique=True)
    objects = UserManager()

    ROLE_CHOICES = (
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )
    # We add the role field
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"


class Company(models.Model):
    name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=2)
    city = models.CharField(max_length=50)
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
