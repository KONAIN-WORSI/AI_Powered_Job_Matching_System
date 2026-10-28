from rest_framework import serializers
from .models import Resume

class ResumeUploadSerializer(serializers.Serializer):
    file = serializers.FileField(allow_empty_file=False)
    is_primary = serializers.BooleanField(default=False)


class ResumeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'extracted_skills', 'is_primary', 'created_at']

    

