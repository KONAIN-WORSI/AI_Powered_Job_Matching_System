# API Contract (Initial)

Base path: `/api/`. JSON responses use Django REST Framework conventions.
Authentication, pagination, filters, and final response schemas must be agreed
before endpoint implementation.

| Method | Path | Purpose | Initial status |
| --- | --- | --- | --- |
| `POST` | `/accounts/register/` | Create an account | Planned |
| `POST` | `/accounts/login/` | Authenticate | Planned |
| `GET`, `POST` | `/resumes/` | List or upload owned resumes | Planned |
| `GET` | `/resumes/{id}/` | Read resume parse status and skills | Planned |
| `GET` | `/jobs/` | Search normalized job listings | Planned |
| `GET` | `/jobs/{id}/` | Read job details | Planned |
| `GET` | `/matches/` | List ranked matches for the current seeker | Planned |
| `GET`, `POST` | `/employers/jobs/` | Manage employer jobs | Planned |
| `GET` | `/employers/candidates/` | Review matched candidates | Planned |

The URL modules are mounted in the root router, but contain no endpoints yet.
