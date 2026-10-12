from rest_framework.permissions import BasePermission


class IsJobSeeker(BasePermission):
    """Allow only authenticated job-seeker accounts."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'job_seeker'
        )
