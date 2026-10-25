from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import JobSeekerProfile, EmployerProfile, Company
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model

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


    def validate_role(self, value):
        # Fix D: Prevent users from registering as 'admin'
        if value not in ['job_seeker', 'employer']:
            raise serializers.ValidationError("Invalid role selected.")
        return value


    def validate(self, attrs):
        # Fix C: Require company_name if role is employer
        if attrs.get('role') == 'employer' and not attrs.get('company_name'):
            raise serializers.ValidationError({"company_name": "Company name is required for employers."})
        return attrs
    

    @transaction.atomic
    def create(self, validated_data):
        # Fix B: Normalize email to lowercase
        email = validated_data['email'].lower()
        
        # Extract profile data
        full_name = validated_data.pop('full_name', '')
        company_name = validated_data.pop('company_name', '')
        job_title = validated_data.pop('job_title', '')
        role = validated_data.get('role')

        # Create User
        user = User.objects.create_user(
            email=email,
            password=validated_data['password'],
            role=role
        )

        # Fix F: Explicitly create profiles (No hidden signals)
        if role == 'job_seeker':
            JobSeekerProfile.objects.update_or_create(
                user=user,
                defaults={'full_name': full_name},
            )
        elif role == 'employer':
            company, _ = Company.objects.get_or_create(name=company_name, defaults={'country': 'NP'})
            EmployerProfile.objects.update_or_create(
                user=user,
                defaults={'company': company, 'job_title': job_title},
            )

        return user
    

class CustomLoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop(User.USERNAME_FIELD, None)

    def validate(self, attrs):
        # Resolve the email to the account username, then authenticate normally.
        try:
            account = User.objects.get(email__iexact=attrs['email'])
        except User.DoesNotExist:
            raise AuthenticationFailed('No active account found with the given credentials')

        user = authenticate(
            request=self.context.get('request'),
            username=account.get_username(),
            password=attrs['password'],
        )
        if user is None:
            raise AuthenticationFailed('No active account found with the given credentials')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role,
        }