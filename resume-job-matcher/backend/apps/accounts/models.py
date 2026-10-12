from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        JOB_SEEKER = 'job_seeker', 'Job seeker'
        EMPLOYER = 'employer', 'Employer'

    role = models.CharField(max_length=20, choices=Role.choices, blank=True)

# Create your models here.
