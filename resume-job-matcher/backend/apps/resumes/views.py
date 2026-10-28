import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsJobSeeker
from .models import Resume
from apps.accounts.models import JobSeekerProfile
from .services import process_resume_file
from .serializers import ResumeUploadSerializer, ResumeDetailSerializer

logger = logging.getLogger(__name__)


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_obj = serializer.validated_data['file']
        is_primary = serializer.validated_data['is_primary']

        try:
            job_seeker = request.user.jobseekerprofile
        except JobSeekerProfile.DoesNotExist:
            return Response(
                {"error": "Job seeker profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            ml_data = process_resume_file(file_obj)

            if is_primary:
                Resume.objects.filter(job_seeker=job_seeker).update(is_primary=False)

            resume = Resume.objects.create(
                job_seeker=job_seeker,
                file=file_obj,
                is_primary=is_primary,
                **ml_data,
            )

            return Response(
                {
                    "message": "Successfully uploaded the resume",
                    "payload": ResumeDetailSerializer(resume).data,
                },
                status=status.HTTP_201_CREATED,
            )

        except ValueError as e:
            # Catch specific parsing errors (e.g., bad PDF)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            # Catch all other unexpected errors
            logger.exception("Unexpected error while processing resume upload")
            return Response(
                {"error": "An internal error occurred during processing."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
