# Initial ERD

The model details are intentionally provisional until product fields and
retention rules are confirmed.

```mermaid
erDiagram
    USER ||--o{ RESUME : owns
    USER ||--o| JOB_SEEKER_PROFILE : has
    USER ||--o| EMPLOYER_PROFILE : has
    EMPLOYER_PROFILE ||--o{ JOB : posts
    RESUME ||--o{ MATCH : receives
    JOB ||--o{ MATCH : ranks
    USER ||--o{ APPLICATION : submits
    JOB ||--o{ APPLICATION : receives
```

The Django app models are scaffolds; migrations will be generated after the
domain fields and relationships are finalized.
