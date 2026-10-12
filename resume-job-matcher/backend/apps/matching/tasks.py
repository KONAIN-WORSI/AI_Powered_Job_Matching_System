from celery import shared_task


@shared_task
def run_matching(resume_id: int) -> None:
    raise NotImplementedError(f'Matching is not configured for resume {resume_id}.')
