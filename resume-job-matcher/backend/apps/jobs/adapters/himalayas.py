from .base import JobSourceAdapter


class HimalayasAdapter(JobSourceAdapter):
    def fetch_jobs(self) -> list[dict[str, object]]:
        raise NotImplementedError('Himalayas API integration has not been configured.')
