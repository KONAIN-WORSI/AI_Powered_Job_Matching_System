from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import JobSeekerProfile, EmployerProfile, Company

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Add fields that aren't in the default User model
    full_name = serializers.CharField(write_only=True, required=False)
    company_name = serializers.CharField(write_only=True, required=False)
    job_title = serializers.CharField(write_only=True, required=False)
    
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'role', 'full_name', 'company_name', 'job_title')
        # We use email as the unique identifier instead of username based on your UI
        extra_kwargs = {
            'email': {'required': True}
        }

    def create(self, validated_data):
        # 1. Extract the profile data
        full_name = validated_data.pop('full_name', '')
        company_name = validated_data.pop('company_name', '')
        job_title = validated_data.pop('job_title', '')
        
        # 2. Create the User
        # Since your UI uses Email, we will automatically generate a username from the email
        email = validated_data['email']
        username = email.split('@')[0] 
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            role=validated_data.get('role', 'job_seeker')
        )

        # 3. Update the Profile (The signal already created it, now we fill it)
        if user.role == 'job_seeker':
            profile = user.job_seeker_profile
            profile.full_name = full_name
            profile.save()
            
        elif user.role == 'employer':
            # Create or get the company
            company, _ = Company.objects.get_or_create(name=company_name, defaults={'country': 'NP'})
            
            profile = user.employer_profile
            profile.company = company
            profile.job_title = job_title
            profile.save()

        return user