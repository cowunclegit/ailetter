# Research: Subscriber Management UI & Sync

**Status**: Complete
**Created**: 2026-01-21

## Key Decisions

### Database Schema
- **Decision**: Use a relational schema with a `subscribers` table and a `subscriber_categories` join table.
- **Rationale**: SQLite is the existing database. A join table is the standard way to model many-to-many relationships (Subscribers <-> AI Subject Presets) in SQL.
- **Alternatives Considered**: Storing categories as a JSON string in the `subscribers` table. Rejected because it limits queryability and referential integrity.

### Unsubscribe Mechanism
- **Decision**: Use a dedicated internal API endpoint (`POST /api/subscribers/unsubscribe/:uuid`) and a frontend route (`/unsubscribe/:uuid`).
- **Rationale**: 
    - **Security**: The UUID acts as a secure, hard-to-guess token.
    - **UX**: A dedicated frontend page allows for a friendly confirmation message and potential re-subscribe options in the future.
    - **Architecture**: Keeps the logic decoupled; the backend handles the state change, the frontend handles the presentation.

### Sync Skeleton Strategy
- **Decision**: Implement a `POST /api/subscribers/sync` endpoint that performs a "dry run" or mock execution.
- **Rationale**: The requirements explicitly ask for a skeleton. Logging to the console and returning success allows the UI flow to be developed and tested without waiting for the external API.
- **Behavior**: It will simulate fetching a list of users, checking for duplicates by email, and "updating" them (logging the action) without actually modifying the DB for now, or updating real records if we choose to make it more functional later. *Refinement based on Spec*: The spec says "Merge & Update". So the skeleton *will* actually update local records if the logic is implemented, but since it's a "skeleton" and we don't have the external source, the "fetch" part will be mocked. For this feature, the *mock* source will be hardcoded or empty, effectively doing nothing but logging, as per the simplest interpretation of "skeleton" unless we mock data generation. *Correction*: The spec FR-008 says "process data such that existing records... are updated". I will implement the *logic* to update, but the *source* data will be a static mock list inside the controller for demonstration.

### UI/UX Libraries
- **Decision**: Use Material UI (`@mui/material`) for the management table and forms.
- **Rationale**: Consistent with the existing project UI.
- **Components**: `DataGrid` or `Table` for the list, `Dialog` for add/edit forms, `Switch` for subscription status.

## Technical Unknowns & resolutions
- **Unknown**: Specifics of the "AI Subject Presets" table.
- **Resolution**: I will assume a standard `id` and `name` structure. I will verify the table name during implementation (likely `ai_subject_presets` or similar). *Action*: Check `backend/src/models` or `backend/src/db` if possible, but safe to assume standard keys.

## Dependencies
- **Backend**: `uuid` (for generating tokens), `sqlite3`.
- **Frontend**: `@mui/material`, `axios`, `react-router-dom`.
- **All verified as available.**
