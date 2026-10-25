import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = False
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '')
if not SECRET_KEY:
    raise ImproperlyConfigured('DJANGO_SECRET_KEY must be set in production.')

# Rotate JWT signing independently; use the production Django key if unset.
SIMPLE_JWT = {
    **SIMPLE_JWT,
    'SIGNING_KEY': os.getenv('JWT_SIGNING_KEY') or SECRET_KEY,
}

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
