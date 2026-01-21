# Data Model: Infrastructure Reliability and Communication Update

## New Entities

### Proxy Task
Represents a collection job to be performed by the remote proxy service.

| Field | Type | Description |
|-------|------|-------------|
| id | TEXT (UUID) | Unique identifier for the task |
| status | TEXT | One of: `pending`, `processing`, `completed`, `failed` |
| sources | TEXT (JSON) | Array of source objects to collect from |
| created_at | DATETIME | When the task was created |
| updated_at | DATETIME | Last activity for this task |

## Updated Entities

### AI Subject Preset
No schema changes, but initialization logic will ensure default entries exist.
*   Default 1: `Standard Trend Summary`
*   Default 2: `SW Developer Focus` (or similar from spec)

## Configuration (Environment Variables)

### Backend
*   `PROTOCOL`: Default `http`
*   `PORT`: Default `3080`
*   `DATABASE_URL`: Path to SQLite DB

### Proxy Service
*   `MAIN_BACKEND_URL`: URL of the backend (e.g., `http://backend:3080`)
*   `POLLING_INTERVAL`: Default `5000` (ms)
*   `PROXY_SHARED_SECRET`: Auth token for polling
