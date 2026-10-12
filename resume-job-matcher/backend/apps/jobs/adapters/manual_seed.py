from .base import JobSourceAdapter


class ManualSeedAdapter(JobSourceAdapter):
    def fetch_jobs(self) -> list[dict[str, object]]:
        raise NotImplementedError('Manual seed data has not been added.')
