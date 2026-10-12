# Architecture Overview

The application is a React + TypeScript single-page frontend backed by a Django
REST Framework API. PostgreSQL is the intended shared database; SQLite is used
for a quick local backend-only start. Redis is the Celery broker and result
backend. Resume parsing, job refresh, and matching run as asynchronous tasks.

## Backend boundaries
- `accounts`: user identity, profile, and roles.
- `resumes`: uploaded files and extracted resume data.
- `jobs`: normalized job records and source adapters.
- `matching`: match records and ranking engine.
- `employers`: employer workflows, applications, and shortlists.

## Data and integration rules
Job-source adapters must respect each source's terms and permission. Store
normalized source identifiers to support deduplication. Keep resume uploads
private and restrict access to their owners and authorized employer workflows.

## Deployment
Docker Compose provisions PostgreSQL and Redis with the frontend, API, and
Celery worker. Production settings require an externally supplied secret key.
