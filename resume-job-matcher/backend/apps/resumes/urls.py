from django.urls import path
from .views import ResumeUploadView

app_name = 'resumes'
urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
]
