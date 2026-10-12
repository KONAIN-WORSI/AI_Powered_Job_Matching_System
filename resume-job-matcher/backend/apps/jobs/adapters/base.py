from abc import ABC, abstractmethod


class JobSourceAdapter(ABC):
    @abstractmethod
    def fetch_jobs(self) -> list[dict[str, object]]:
        """Fetch raw jobs from one configured source."""
        raise NotImplementedError
