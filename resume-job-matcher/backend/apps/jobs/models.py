from django.db import models
from pgvector.django import VectorField
from pgvector.django import VectorExtension
from apps.accounts.models import EmployerProfile, Company

class Job(models.Model):
    SOURCE_CHOICES = [
        ('himalayas', 'Himalayas'),
        ('merojob', 'MeroJob'),
        ('employer', 'Employer'),
        ('manual', 'Manual')
    ]

    source = models.CharField(max_length=100, choices=SOURCE_CHOICES)
    external_id = models.CharField(max_length=200, blank=True, null=True)

    employer = models.ForeignKey(EmployerProfile,on_delete=models.SET_NULL, blank=True, null=True)
    company = models.ForeignKey(Company,on_delete=models.SET_NULL, blank=True, null=True)

    title = models.CharField(max_length=100)
    description = models.TextField()
    country = models.CharField(max_length=2)
    city = models.CharField(max_length=100, blank=True, null=True)
    job_type = models.CharField(max_length=20, blank=True, null=True)
    experience_level = models.CharField(max_length=20, blank=True, null=True)
    salary_min = models.IntegerField(blank=True, null=True)
    salary_max = models.IntegerField(blank=True, null=True)
    apply_url = models.CharField(max_length=500, blank=True, null=True)

    # ML Pipeline fields
    required_skills = models.JSONField(default=list)   
    embedding = VectorField(dimensions=384)
    embedding_version = models.CharField(max_length=50, default='all-MiniLM-L6-v2')
    
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(blank=True, null=True)
    fetched_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title







