from django.db import models
from pgvector.django import VectorField
from apps.accounts.models import JobSeekerProfile
from cloudinary_storage.storage import MediaCloudinaryStorage

# Create your models here.
class Resume(models.Model):
    job_seeker = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE)

    file = models.FileField(upload_to='resumes/', storage=MediaCloudinaryStorage())

    raw_text = models.TextField()
    extracted_skills = models.JSONField(default=list)
    embeddings = VectorField(dimensions=384)
    embedding_version = models.CharField(max_length=50, default='all-MiniLM-L6-v2')

    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume {self.id} for {self.job_seeker.user.email} (primary : {self.is_primary})"