from .base import *  # noqa: F403

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https?://(localhost|127\.0\.0\.1)(:\d+)?$',
]
