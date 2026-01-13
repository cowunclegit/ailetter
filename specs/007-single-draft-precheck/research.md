# Research: Single Draft Constraint and Dashboard Pre-check

## 1. Single Draft Enforcement & Overwrite Logic
- **Decision**: Implement a database transaction in `NewsletterModel.createDraft` that first deletes any existing record with `status = 'draft'` before inserting the new one.
- **Rationale**: This ensures the "one draft at a time" rule is enforced at the data layer, and the overwrite is atomic.
- **Alternatives considered**: Soft-deleting old drafts or updating them. Rejected to maintain a clean linear workflow as requested.

## 2. Real-time Dashboard Sync
- **Decision**: Use immediate Axios calls for each toggle, but implement a 200ms debounce on the frontend for repeated clicks on the same item.
- **Rationale**: Meeting the < 300ms sync target requires a direct API call. Debouncing prevents spamming the SQLite database while keeping the UI responsive.
- **Alternatives considered**: WebSocket sync. Rejected as too complex for the current scale and single-curator assumption.

## 3. Initial Dashboard Detection
- **Decision**: Create a dedicated `GET /api/newsletters/active-draft` endpoint that returns the current draft ID and its item IDs.
- **Rationale**: Allows the dashboard to hydrate its selection state in a single efficient query upon mount.
- **Alternatives considered**: Including draft data in the `GET /api/trends` response. Rejected to keep the trends API generic and focused.
