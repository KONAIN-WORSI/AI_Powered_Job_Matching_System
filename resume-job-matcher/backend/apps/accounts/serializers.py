from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import JobSeekerProfile, EmployerProfile, Company
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
   full_name = serializers.CharField(write_only=True, required=False)
   company = serializers.CharField(write_only=True, required=False)
   job_title = serializers.CharField(write_only=True, required=False)

   password = serializers.CharField(write_only=True)
   role = serializers.CharField(write_only=True)

   class Meta:
      model = User
      fields = ['email', 'password', 'full_name', 'company', 'job_title', 'role']


   @transaction.atomic
   def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        job_title = validated_data.pop('job_title', '')
        company = validated_data.pop('company', '')

        email = validated_data['email'].lower()
        role = validated_data['role']
        company_obj = None
        company_name = company.strip()

        if role == 'employer' and company_name:
            company_obj, _ = Company.objects.get_or_create(name=company_name)

        user = User.objects.create_user(
            email=email,
            password=validated_data['password'],
            role=role
        )

        if role == 'job_seeker':
            JobSeekerProfile.objects.create(
                user=user,
                full_name=full_name,
                years_experience=0
            )
        elif role == 'employer':
            EmployerProfile.objects.create(
                user=user,
                company=company_obj,
                job_title=job_title
            )

        return user
    

class CustomLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The incoming data from React will be in 'attrs'
        # Example: {"email": "john@example.com", "password": "password123"}
        
        # 1. Get the email and password from attrs
        email = attrs.get('email')
        password = attrs.get('password')
        
        # 2. Look up the user in the database (use __iexact to ignore case)
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("No active account found with the given credentials")
            
        # 3. Authenticate the user (check if password is correct)
        # Hint: Use Django's authenticate() function. 
        # Because we use email now, username=user.email
        authenticated_user = authenticate(username=user.email, password=password)
        
        # 4. If authentication fails, raise an error
        if not authenticated_user:
            raise AuthenticationFailed("Invalid password")
            
        # 5. Generate the tokens
        # Hint: Look at the parent class. It has a method called self.get_token(user)
        refresh = self.get_token(authenticated_user)
        
        # 6. Return the tokens and the role
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': authenticated_user.role # Get the user's role
      }


class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True, write_only=True)