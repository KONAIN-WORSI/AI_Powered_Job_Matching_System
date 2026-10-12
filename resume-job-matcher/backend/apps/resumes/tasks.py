from celery import shared_task


@shared_task
def parse_resume(resume_id: int) -> None:
    raise NotImplementedError(f'Resume parsing is not configured for {resume_id}.')
