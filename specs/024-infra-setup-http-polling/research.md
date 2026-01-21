# Research: Infrastructure Reliability and Communication Update

## Unknown 1: Database Initialization
*   **Decision**: Update `backend/src/db/index.js` to perform automatic schema checks and seeding on startup.
*   **Rationale**: Currently, schema migration is a manual step. For a self-healing infrastructure, the application should ensure its environment is ready upon start.
*   **Alternatives considered**: Using a migration library like `knex` or `sequelize`. Rejected to keep the project lightweight and consistent with current raw SQL usage.

## Unknown 2: Server Protocol
*   **Decision**: Revert `backend/src/server.js` to use `http.createServer`.
*   **Rationale**: The user intends to use a reverse proxy (like Nginx) for SSL termination. Running HTTPS in the backend adds unnecessary complexity (certificate management, port conflicts) in this environment.
*   **Alternatives considered**: Keeping HTTPS but allowing it to be optional. Rejected as the requirement explicitly asked for HTTP to simplify reverse proxy integration.

## Unknown 3: Proxy Communication
*   **Decision**: Replace WebSockets with HTTP Polling.
    *   Backend: Add `/api/proxy/tasks` (GET) and `/api/proxy/updates` (POST).
    *   Proxy Service: Use a `setInterval` or recursive `setTimeout` to fetch tasks every 5 seconds.
*   **Rationale**: WebSockets are often blocked in restricted infrastructure. HTTP Polling is more robust and easier to route through standard proxies.
*   **Alternatives considered**: Long polling or Server-Sent Events (SSE). Rejected as simple polling is easier to implement and maintain for this specific use case, and a 5-second interval is acceptable.

## Data Persistence for Tasks
*   **Decision**: Add a `proxy_tasks` table to SQLite.
*   **Rationale**: To ensure reliability, tasks should be persisted so they aren't lost if the backend restarts.
*   **Schema**:
    ```sql
    CREATE TABLE IF NOT EXISTS proxy_tasks (
      id TEXT PRIMARY KEY,
      status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
      sources TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    ```
