from rest_framework.viewsets import ReadOnlyModelViewSet


class JobViewSet(ReadOnlyModelViewSet):
    """Job endpoints will be added alongside the job model."""

    queryset = []

# Create your views here.
