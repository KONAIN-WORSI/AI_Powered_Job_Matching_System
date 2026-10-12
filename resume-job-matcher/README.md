# Resume Job Matcher

Starter monorepo for a resume-to-job matching platform. The backend is Django
and Django REST Framework; the frontend is React, TypeScript, and Vite.

## Requirements
- Python 3.12
- Node.js 22 or newer
- Docker Desktop with Docker Compose (optional)

## Backend setup (PowerShell)
```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements\dev.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

For a quick backend-only start, Django uses SQLite. Copy `backend/.env.example`
to `backend/.env` and configure the variables to use PostgreSQL or Redis. The
ML and document parsing dependencies are optional and listed in
`backend/requirements/ml.txt`.

## Frontend setup
```powershell
cd frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

The API base URL can be changed with `VITE_API_BASE_URL`.

## Docker Compose
From the repository root, start PostgreSQL, Redis, the Django API, Celery worker,
and Vite frontend:
```powershell
docker compose up --build
```

Local Compose credentials are development-only. Never reuse them in deployment.

## Django structure
Use Django's management commands to create apps or migrations. The five apps
already live under `backend/apps/`; root `manage.py` uses
`config.settings.dev`, while ASGI/WSGI use production settings. For a new app,
create its destination first because `startapp` does not create parent folders:
```powershell
cd backend
New-Item -ItemType Directory apps\example
python manage.py startapp example apps\example
# Set the generated AppConfig.name to apps.example and register it in
# config\settings\base.py before adding migrations.
python manage.py makemigrations
python manage.py migrate
```

The app and API modules are scaffolds; their domain models and endpoints still
need implementation. Create a corresponding `apps.py` AppConfig and add it to
`INSTALLED_APPS` when adding a new app.
