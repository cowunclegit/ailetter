# Quickstart: Infrastructure Reliability and Communication Update

## Backend Setup (HTTP)
1.  Ensure `.env` in `backend/` has `PROTOCOL=http`.
2.  Start the backend:
    ```bash
    cd backend
    npm install
    npm start
    ```
3.  The database will be automatically initialized on first run. Verify by checking `dev.db` for the `proxy_tasks` table and `ai_subject_presets` entries.

## Proxy Service Setup (Polling)
1.  Ensure `.env` in `proxy-service/` has:
    ```env
    MAIN_BACKEND_URL=http://localhost:3080
    POLLING_INTERVAL=5000
    PROXY_SHARED_SECRET=your-secret
    ```
2.  Start the proxy service:
    ```bash
    cd proxy-service
    npm install
    npm start
    ```
3.  Check logs for `Polling Main Backend for tasks...`.

## Verification
- Visit `http://localhost:3080/health` (Backend health check).
- Trigger a collection from the dashboard and observe the proxy service logs picking up the task via polling.
