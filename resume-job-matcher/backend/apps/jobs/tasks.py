from celery import shared_task


@shared_task
def fetch_jobs() -> None:
    raise NotImplementedError('Job-source fetching has not been configured yet.')
