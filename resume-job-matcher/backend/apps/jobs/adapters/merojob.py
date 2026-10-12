from .base import JobSourceAdapter


class MeroJobAdapter(JobSourceAdapter):
    def fetch_jobs(self) -> list[dict[str, object]]:
        raise NotImplementedError('MeroJob integration requires permission and configuration.')
